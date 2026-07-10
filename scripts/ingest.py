#!/usr/bin/env python3
"""
CEI3 Ingest Pipeline
====================
1. Sync data/course_meta.json with courses.json (add missing course codes)
2. Validate & generate data/reminders.json from ingest/reminders.json
3. Convert PDFs in ingest/ → md/ (reuses pdf_to_md.py)

Setup:
    data/course_meta.json   ← Fill platform info once per semester
    ingest/reminders.json   ← Edit deadlines, then run this script

Usage:
    python scripts/ingest.py                # run all steps
    python scripts/ingest.py --docs-only    # only convert documents
    python scripts/ingest.py --no-docs      # skip document conversion
    python scripts/ingest.py --no-sync      # skip meta sync
    python scripts/ingest.py --dry-run      # validate only, don't write files
"""

import json
import re
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INGEST_DIR = ROOT / "ingest"
DATA_DIR = ROOT / "data"
MD_DIR = ROOT / "md"
DOCUMENTS_DIR = ROOT / "documents"

COURSES_JSON = DATA_DIR / "courses.json"
COURSE_META_JSON = DATA_DIR / "course_meta.json"
REMINDERS_INPUT = INGEST_DIR / "reminders.json"
REMINDERS_OUTPUT = DATA_DIR / "reminders.json"

VALID_REMINDER_TYPES = {"homework", "group", "exam", "quiz", "project", "admin"}


def log(msg: str, level: str = "info"):
    prefix = {"info": "  ", "ok": "✅", "warn": "⚠️ ", "err": "❌", "hdr": "\n📋"}[level]
    print(f"{prefix} {msg}")


# ── Step 0: Sync course_meta.json ──────────────────────────────────
def sync_course_meta(dry_run: bool = False):
    """Ensure every course in courses.json has a skeleton entry in course_meta.json."""
    log("Syncing course metadata", "hdr")

    if not COURSES_JSON.exists():
        log("data/courses.json not found — run fetch_regis.py first", "warn")
        return True

    with open(COURSES_JSON, encoding="utf-8") as f:
        courses_data = json.load(f)

    # Collect all unique course codes
    all_codes = set()
    for year_data in courses_data.get("years", {}).values():
        for c in year_data.get("courses", []):
            code = c.get("code")
            if code:
                all_codes.add(code)

    # Load existing meta (skip keys starting with _)
    meta = {}
    if COURSE_META_JSON.exists():
        with open(COURSE_META_JSON, encoding="utf-8") as f:
            raw = json.load(f)
            for k, v in raw.items():
                if isinstance(v, dict) and not k.startswith("_"):
                    meta[k] = v

    # Find missing codes
    missing = sorted(all_codes - set(meta.keys()))
    stale = sorted(set(meta.keys()) - all_codes)

    # Build code -> name map from courses.json
    code_names = {}
    for year_data in courses_data.get("years", {}).values():
        for c in year_data.get("courses", []):
            code = c.get("code")
            name = c.get("name")
            if code and name and code not in code_names:
                code_names[code] = name

    # Also refresh _name on existing entries (in case names change)
    updated_names = 0
    for code in meta:
        if code in code_names and meta[code].get("_name") != code_names[code]:
            meta[code]["_name"] = code_names[code]
            updated_names += 1

    if not missing and not stale and not updated_names:
        log(f"All {len(all_codes)} courses already in course_meta.json", "ok")
        return True

    if updated_names:
        log(f"Updated _name on {updated_names} existing course(s)", "ok")

    if missing:
        for code in missing:
            meta[code] = {
                "_name": code_names.get(code, ""),
                "platform": None,
                "platform_detail": None,
                "notes": None,
            }
        log(f"Added {len(missing)} missing course(s):", "ok")
        for code in missing:
            log(f"  {code}  {(code_names.get(code, ''))[:50]}", "info")

    if stale:
        log(
            f"{len(stale)} stale entr{'y' if len(stale) == 1 else 'ies'} (not in courses.json):",
            "warn",
        )
        for code in stale:
            log(f"  {code}", "info")

    if dry_run:
        log("[DRY RUN] Would update course_meta.json", "ok")
        return True

    with open(COURSE_META_JSON, "w", encoding="utf-8") as f:
        # Preserve _howto if it exists
        output = {}
        if "_howto" in (raw if COURSE_META_JSON.exists() else {}):
            output["_howto"] = raw["_howto"]
        output.update(meta)
        json.dump(output, f, ensure_ascii=False, indent=2)

    log(f"Wrote {len(meta)} entries → {COURSE_META_JSON}", "ok")
    return True


# ── Step 1: Generate reminders.json ───────────────────────────────
def generate_reminders(dry_run: bool = False):
    """Read ingest/reminders.json, validate, output data/reminders.json."""
    log("Generating reminders", "hdr")

    if not REMINDERS_INPUT.exists():
        log("ingest/reminders.json not found — skipping", "warn")
        return True

    with open(REMINDERS_INPUT, encoding="utf-8") as f:
        input_data = json.load(f)

    reminders_raw = input_data.get("reminders", [])
    if not reminders_raw:
        log("No reminders in ingest/reminders.json — clearing output", "warn")
        output = {
            "generated": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "count": 0,
            "reminders": [],
        }
        if dry_run:
            return True
        REMINDERS_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        with open(REMINDERS_OUTPUT, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        log("Wrote empty reminders.json", "ok")
        return True

    # Cross-reference course names
    course_names = {}
    if COURSES_JSON.exists():
        with open(COURSES_JSON, encoding="utf-8") as f:
            courses_data = json.load(f)
        for year_data in courses_data.get("years", {}).values():
            for c in year_data.get("courses", []):
                code = c.get("code")
                name = c.get("name")
                if code and name and code not in course_names:
                    course_names[code] = name

    validated = []
    errors = 0
    warnings = 0

    for i, r in enumerate(reminders_raw):
        title = r.get("title", "").strip()
        date_str = r.get("date", "").strip()
        rtype = r.get("type", "").strip().lower()
        code = r.get("course_code", "").strip()

        if not title:
            log(f"Reminder #{i + 1}: missing title", "err")
            errors += 1
            continue

        if not re.match(r"^\d{4}-\d{2}-\d{2}$", date_str):
            log(f'"{title}": invalid date "{date_str}" — use YYYY-MM-DD', "err")
            errors += 1
            continue

        try:
            datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            log(f'"{title}": invalid date "{date_str}"', "err")
            errors += 1
            continue

        if rtype not in VALID_REMINDER_TYPES:
            log(
                f'"{title}": unknown type "{rtype}" — valid: {VALID_REMINDER_TYPES}',
                "err",
            )
            errors += 1
            continue

        if code and code not in course_names:
            log(f'"{title}": course_code "{code}" not found in courses.json', "warn")
            warnings += 1

        course_name = course_names.get(code, "") if code else ""
        validated.append(
            {
                "title": title,
                "date": date_str,
                "type": rtype,
                "course_code": code,
                "course_name": course_names.get(code, ""),
            }
        )

    if errors:
        log(f"{errors} validation error(s) — fix and re-run", "err")
        return False

    validated.sort(key=lambda r: r["date"])

    output = {
        "generated": datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
        "count": len(validated),
        "reminders": validated,
    }

    if dry_run:
        log(f"[DRY RUN] Would write {len(validated)} reminder(s)", "ok")
        for r in validated:
            log(f"  {r['date']}  {r['type']:8s}  {r['title']}")
        if warnings:
            log(f"[DRY RUN] {warnings} warning(s)", "warn")
        return True

    REMINDERS_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    with open(REMINDERS_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    log(f"Wrote {len(validated)} reminder(s) → {REMINDERS_OUTPUT}", "ok")
    if warnings:
        log(f"{warnings} warning(s) — see above", "warn")
    return True


# ── Step 2: Convert PDFs ──────────────────────────────────────────
def convert_documents(dry_run: bool = False):
    """Find PDFs in ingest/, convert to markdown, move originals to documents/."""
    log("Converting documents", "hdr")

    pdf_files = sorted(INGEST_DIR.glob("*.pdf"))
    if not pdf_files:
        log("No PDFs found in ingest/", "info")
        return True

    pdf_to_md_script = ROOT / "scripts" / "pdf_to_md.py"

    for pdf_path in pdf_files:
        if dry_run:
            log(f"[DRY RUN] Would convert: {pdf_path.name}", "ok")
            continue

        log(f"Converting: {pdf_path.name}")
        result = subprocess.run(
            [sys.executable, str(pdf_to_md_script), str(pdf_path)],
            capture_output=True,
            text=True,
            cwd=str(ROOT),
        )

        if result.returncode != 0:
            log(f"Conversion failed for {pdf_path.name}:", "err")
            print(result.stderr)
            continue

        for line in result.stdout.strip().split("\n"):
            if ".md" in line and ("written to" in line.lower() or MD_DIR.name in line):
                log(f"Output: {line.strip()}", "ok")

        dest = DOCUMENTS_DIR / pdf_path.name
        shutil.move(str(pdf_path), str(dest))
        log(f"Moved PDF → {dest}", "info")

    log(
        "Document conversion complete. Review the .md files in md/ and re-run build_index.py",
        "ok",
    )
    return True


# ── Main ──────────────────────────────────────────────────────────
def main():
    import argparse

    parser = argparse.ArgumentParser(description="CEI3 Ingest Pipeline")
    parser.add_argument(
        "--docs-only", action="store_true", help="Only convert documents"
    )
    parser.add_argument(
        "--no-docs", action="store_true", help="Skip document conversion"
    )
    parser.add_argument(
        "--no-sync", action="store_true", help="Skip course_meta.json sync"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Validate only, don't write files"
    )
    args = parser.parse_args()

    if args.dry_run:
        log("[DRY RUN MODE] No files will be written", "warn")

    ok = True

    if args.docs_only:
        ok &= convert_documents(dry_run=args.dry_run)
    else:
        if not args.no_sync:
            ok &= sync_course_meta(dry_run=args.dry_run)
        ok &= generate_reminders(dry_run=args.dry_run)
        if not args.no_docs:
            ok &= convert_documents(dry_run=args.dry_run)

    if args.dry_run:
        log("Dry run complete — no files written", "ok")
        return

    if ok:
        log("Ingest pipeline complete!", "ok")
        log("Next: commit and push to deploy", "info")
    else:
        log("Ingest pipeline completed with errors — see above", "err")
        sys.exit(1)


if __name__ == "__main__":
    main()
