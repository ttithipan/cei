#!/usr/bin/env python3
"""
Fetch CEI course timetable from KMITL Regis and save as JSON.

Uses Playwright to render the Angular SPA, extract the teach_table data,
and output structured JSON to data/courses.json.

Usage (local):
    pip install playwright && playwright install chromium
    python scripts/fetch_regis.py

Usage (GitHub Actions):
    Runs automatically on schedule via .github/workflows/fetch-regis.yml
"""

import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
OUTPUT = DATA_DIR / "courses.json"

# ── Regis URL params ────────────────────────────────────────────────
REGIS_BASE = "https://regis.reg.kmitl.ac.th"
REGIS_PATH = "/#/teach_table"

# Default values — auto-detected from current date, overridable via env vars
FACULTY = "01"
DEPARTMENT = "05"
CURRICULUM = "127"

# Year tabs to scrape (1-4)
CLASS_YEARS = ["1", "2", "3", "4"]


def detect_semester() -> tuple[str, str]:
    """
    Auto-detect academic year (พ.ศ.) and semester from current date.
    Schedule publishing pattern:
      - June:     Semester 1 schedule available → scrape Sem 1
      - October:  Semester 2 schedule available → scrape Sem 2
    Override with env vars REGIS_YEAR and REGIS_SEMESTER.
    """
    year_env = os.environ.get("REGIS_YEAR", "").strip()
    sem_env = os.environ.get("REGIS_SEMESTER", "").strip()

    if year_env and sem_env:
        return year_env, sem_env

    now = datetime.now()
    month = now.month
    buddhist_year = now.year + 543

    if 6 <= month <= 9:
        # June–September: Semester 1 of this Buddhist year
        return str(buddhist_year), "1"
    else:
        # October–May: Semester 2
        # Academic year doesn't change in January — Buddhist year does.
        # Oct–Dec: buddhist_year is still the same (e.g. Oct 2026 → 2569)
        # Jan–May: buddhist_year has ticked over (e.g. Jan 2027 → 2570, but still academic year 2569)
        if month >= 10:
            return str(buddhist_year), "2"
        else:
            return str(buddhist_year - 1), "2"


DAY_MAP = {
    "sunday": 0,
    "monday": 1,
    "tuesday": 2,
    "wednesday": 3,
    "thursday": 4,
    "friday": 5,
    "saturday": 6,
    "sun": 0,
    "mon": 1,
    "tue": 2,
    "wed": 3,
    "thu": 4,
    "fri": 5,
    "sat": 6,
    "อาทิตย์": 0,
    "จันทร์": 1,
    "อังคาร": 2,
    "พุธ": 3,
    "พฤหัสบดี": 4,
    "ศุกร์": 5,
    "เสาร์": 6,
    "อา.": 0,
    "จ.": 1,
    "อ.": 2,
    "พ.": 3,
    "พฤ.": 4,
    "ศ.": 5,
    "ส.": 6,
}


def build_url(class_year: str, year: str, semester: str) -> str:
    params = (
        f"mode=by_class"
        f"&selected_year={year}"
        f"&selected_semester={semester}"
        f"&selected_faculty={FACULTY}"
        f"&selected_department={DEPARTMENT}"
        f"&selected_curriculum={CURRICULUM}"
        f"&selected_class_year={class_year}"
        f"&search_all_faculty=false"
        f"&search_all_department=false"
        f"&search_all_curriculum=false"
        f"&search_all_class_year=false"
    )
    return f"{REGIS_BASE}{REGIS_PATH}?{params}"


def parse_day(text: str) -> int | None:
    """Parse day string to 0-based index (Sun=0)."""
    if not text:
        return None
    t = text.strip().lower()
    return DAY_MAP.get(t)


def parse_time_range(text: str) -> tuple[str, str] | None:
    """Parse '09:00-12:00' or '09.00-12.00' into (start, end)."""
    if not text:
        return None
    m = re.match(r"(\d{1,2})[.:](\d{2})\s*[-–—]\s*(\d{1,2})[.:](\d{2})", text.strip())
    if m:
        start = f"{int(m.group(1)):02d}:{m.group(2)}"
        end = f"{int(m.group(3)):02d}:{m.group(4)}"
        return start, end
    return None


THAI_MONTHS = {
    "มกราคม": 1,
    "กุมภาพันธ์": 2,
    "มีนาคม": 3,
    "เมษายน": 4,
    "พฤษภาคม": 5,
    "มิถุนายน": 6,
    "กรกฎาคม": 7,
    "สิงหาคม": 8,
    "กันยายน": 9,
    "ตุลาคม": 10,
    "พฤศจิกายน": 11,
    "ธันวาคม": 12,
    "ม.ค.": 1,
    "ก.พ.": 2,
    "มี.ค.": 3,
    "เม.ย.": 4,
    "พ.ค.": 5,
    "มิ.ย.": 6,
    "ก.ค.": 7,
    "ส.ค.": 8,
    "ก.ย.": 9,
    "ต.ค.": 10,
    "พ.ย.": 11,
    "ธ.ค.": 12,
}


def parse_exam_dates(exam_text: str) -> tuple[str | None, str | None]:
    """
    Parse exam column text like:
      Midterm\nพุธ 19 สิงหาคม 2569\n09:30 - 12:30\nFinal\nพุธ 28 ตุลาคม 2569\n09:30 - 12:30
    Returns (midterm_iso, final_iso) or (None, None).
    """
    if not exam_text:
        return None, None
    lines = [l.strip() for l in exam_text.split("\n") if l.strip()]
    midterm = None
    final = None
    current_label = None
    for line in lines:
        low = line.lower()
        if low == "midterm":
            current_label = "midterm"
        elif low == "final":
            current_label = "final"
        elif current_label and "จัดสอบเอง" in line:
            current_label = None
        elif current_label:
            # Try to parse Thai date: "พุธ 19 สิงหาคม 2569" (day-of-week prefix, then date)
            m = re.search(r"(\d{1,2})\s+(\S+)\s+(\d{4})", line)
            if m:
                day = int(m.group(1))
                month_str = m.group(2)
                year_buddhist = int(m.group(3))
                month = THAI_MONTHS.get(month_str)
                if month:
                    year_gregorian = year_buddhist - 543
                    date_str = f"{year_gregorian:04d}-{month:02d}-{day:02d}"
                    if current_label == "midterm":
                        midterm = date_str
                    else:
                        final = date_str
                current_label = None
                current_label = None
    return midterm, final


def extract_courses_from_page(page) -> list[dict]:
    """
    Extract course rows from KMITL regis teach_table.
    Columns: 0=รหัส, 1=ชื่อวิชา, 2=หน่วยกิต, 3=กลุ่มเรียน, 4=วัน-เวลา, 5=ห้อง, 6=ตึก, 7=อาจารย์, 8=สอบ
    Day-Time format: "พฤหัสบดี 13:00-16:00" (full Thai day name + space + time range)
    """
    courses = []

    try:
        tables = page.locator("table").all()
        table_sizes = []
        for i, table in enumerate(tables):
            rows = table.locator("tbody tr").all()
            if not rows:
                rows = table.locator("tr").all()
            table_sizes.append((i, len(rows), table))
        table_sizes.sort(key=lambda x: -x[1])

        if not table_sizes:
            return courses

        for table_idx, row_count, table in table_sizes[:3]:
            if row_count < 2:
                continue

            rows = table.locator("tbody tr").all()
            if not rows:
                rows = table.locator("tr").all()

            print(f"      Table #{table_idx} ({row_count} rows):")
            for i, row in enumerate(rows[: min(2, len(rows))]):
                cells = row.locator("td, th").all()
                cell_texts = [c.inner_text().strip()[:50] for c in cells]
                print(f"        Row {i} ({len(cells)} cols): {cell_texts[:10]}")

            for row in rows:
                cells = row.locator("td, th").all()
                if len(cells) < 5:
                    continue
                # Skip <th> header rows
                if cells[0].evaluate("el => el.tagName") == "TH":
                    continue

                texts = [c.inner_text().strip() for c in cells]

                code = texts[0] if len(texts) > 0 else ""
                name = texts[1] if len(texts) > 1 else ""
                credit = texts[2] if len(texts) > 2 else ""
                section_raw = texts[3] if len(texts) > 3 else ""
                day_time = texts[4] if len(texts) > 4 else ""
                room = texts[5] if len(texts) > 5 else ""
                building = texts[6] if len(texts) > 6 else ""
                teacher = texts[7] if len(texts) > 7 else ""
                exam_text = texts[8] if len(texts) > 8 else ""

                # Must have a course code or name
                if not re.match(r"^\d{8}$", code) and not name:
                    continue

                # Determine kind from section text
                kind = "theory"
                if re.search(r"ปฏิบัติ|lab|Lab|LAB", section_raw):
                    kind = "lab"

                # Extract section number (first number in section cell)
                section_num = None
                sm = re.search(r"(\d+)", section_raw)
                if sm:
                    section_num = sm.group(1)

                # Parse day-time: supports "+ " and "\n+ " separators for split sessions
                # e.g. "พุธ 08:45-10:15\n+ พุธ 10:30-12:00"
                segments = re.split(r"\n?\+\s+", day_time) if day_time else []

                # Build room string (avoid duplicates like "HM 601 HM")
                room_parts = []
                if room and room != "-":
                    room_parts.append(room)
                if building and building != "-" and building not in (room or ""):
                    room_parts.append(building)
                full_room = " ".join(room_parts).strip() or None

                midterm, final = parse_exam_dates(exam_text)

                for seg in segments:
                    seg = seg.strip()
                    if not seg:
                        continue

                    day = None
                    start = None
                    end = None

                    # Try matching full Thai day name at start
                    for abbr, idx in sorted(DAY_MAP.items(), key=lambda x: -len(x[0])):
                        if seg.startswith(abbr):
                            day = idx
                            remainder = seg[len(abbr) :].strip()
                            times = parse_time_range(remainder)
                            if times:
                                start, end = times
                            break

                    # Fallback: try matching shorter abbreviations
                    if day is None:
                        for abbr, idx in DAY_MAP.items():
                            if len(abbr) <= 5 and abbr in seg:
                                day = idx
                                times = parse_time_range(seg)
                                if times:
                                    start, end = times
                                break

                    if name and day is not None:
                        courses.append(
                            {
                                "code": code if re.match(r"^\d{8}$", code) else None,
                                "name": name.strip(),
                                "section": section_num,
                                "kind": kind,
                                "day": day,
                                "start": start,
                                "end": end,
                                "hasBreak": len(segments) > 1 or None,
                                "room": full_room,
                                "teacher": teacher.replace("\n", ", ")
                                if teacher
                                else None,
                                "credit": credit or None,
                                "tag": "GenEd" if code.startswith("9664") else None,
                                "midterm": midterm,
                                "final": final,
                            }
                        )

            # Collect from ALL tables (regis has multiple groups)

    except Exception as e:
        print(f"      ⚠️  Table extraction failed: {e}")
        import traceback

        traceback.print_exc()

    return courses


def extract_academic_period(page) -> dict | None:
    """
    Extract academic period (start/end dates) from the regis page.
    The dates are often in a header, info bar, or revealed by clicking
    a calendar/date element. Returns {"start": "...", "end": "..."} or None.
    """
    # Thai month abbreviations for parsing
    month_map = {
        "ม.ค.": 1,
        "ก.พ.": 2,
        "มี.ค.": 3,
        "เม.ย.": 4,
        "พ.ค.": 5,
        "มิ.ย.": 6,
        "ก.ค.": 7,
        "ส.ค.": 8,
        "ก.ย.": 9,
        "ต.ค.": 10,
        "พ.ย.": 11,
        "ธ.ค.": 12,
        "มกราคม": 1,
        "กุมภาพันธ์": 2,
        "มีนาคม": 3,
        "เมษายน": 4,
        "พฤษภาคม": 5,
        "มิถุนายน": 6,
        "กรกฎาคม": 7,
        "สิงหาคม": 8,
        "กันยายน": 9,
        "ตุลาคม": 10,
        "พฤศจิกายน": 11,
        "ธันวาคม": 12,
        "Jan": 1,
        "Feb": 2,
        "Mar": 3,
        "Apr": 4,
        "May": 5,
        "Jun": 6,
        "Jul": 7,
        "Aug": 8,
        "Sep": 9,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12,
    }

    # Try clicking elements that might reveal the class period
    click_selectors = [
        "[class*=calendar]",
        "[class*=date]",
        "[class*=period]",
        "[class*=semester]",
        "[class*=schedule]",
        "[class*=info]",
        ".dropdown-toggle",
        "button:has-text('สอน')",
        "button:has-text('ตาราง')",
    ]
    for selector in click_selectors:
        try:
            el = page.locator(selector).first
            if el.is_visible():
                el.click()
                page.wait_for_timeout(800)
        except Exception:
            pass

    # Now look for date range patterns in page text
    body_text = ""
    try:
        body_text = page.locator("body").inner_text()
    except Exception:
        pass

    months_pattern = "|".join(re.escape(m) for m in month_map.keys())

    # Pattern: "ว. 1 ม.ค. 2567 - 30 มิ.ย. 2567" (Thai date range with dash)
    date_range = re.search(
        rf"(\d{{1,2}}\s+({months_pattern})\s+(\d{{4}}))\s*[-–—]\s*(\d{{1,2}}\s+({months_pattern})\s+(\d{{4}}))",
        body_text,
    )
    if date_range:
        return {
            "start": date_range.group(1).strip(),
            "end": date_range.group(4).strip(),
        }

    # ISO dates: 2024-08-12 - 2024-12-06
    iso_range = re.search(
        r"(\d{{4}}-\d{{2}}-\d{{2}})\s*[-–—to]+\s*(\d{{4}}-\d{{2}}-\d{{2}})", body_text
    )
    if iso_range:
        return {"start": iso_range.group(1), "end": iso_range.group(2)}

    # Debug: log any date-like text found
    for m in re.finditer(rf"\d{{1,2}}\s+({months_pattern})\s+\d{{4}}", body_text):
        ctx_start = max(0, m.start() - 40)
        ctx_end = min(len(body_text), m.end() + 60)
        print(f"      Date context: ...{body_text[ctx_start:ctx_end]}...")

    return None


def scrape_with_playwright(year: str, semester: str) -> tuple[dict, dict | None]:
    """Scrape all year tabs using Playwright."""
    from playwright.sync_api import sync_playwright

    years = {}
    academic_period = None
    debug_dir = Path("data/debug")
    debug_dir.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1280, "height": 900},
            locale="th-TH",
        )

        for class_year in CLASS_YEARS:
            url = build_url(class_year, year, semester)
            print(f"   Year {class_year}: {url}")

            page = context.new_page()
            try:
                # Navigate and wait for Angular to bootstrap
                page.goto(url, wait_until="domcontentloaded", timeout=30000)

                # Wait for the Angular app root to appear
                try:
                    page.wait_for_selector(
                        "app-root, #app, [ng-version], .main-content, router-outlet",
                        timeout=10000,
                    )
                except Exception:
                    pass  # Angular root selector might differ

                # Wait extra time for XHR data to load and render
                print(f"      Waiting for data to load...")
                page.wait_for_timeout(8000)

                # Try waiting for network to settle
                try:
                    page.wait_for_load_state("networkidle", timeout=15000)
                except Exception:
                    pass

                # Extra wait after network settles
                page.wait_for_timeout(5000)

                # Debug: save page text
                try:
                    body_text = page.locator("body").inner_text()[:3000]
                    print(f"      Page text preview: {body_text[:300]}...")
                    # Save full text for the first tab to help debug date extraction
                    if class_year == CLASS_YEARS[0]:
                        (debug_dir / "body_text.txt").write_text(
                            page.locator("body").inner_text(), encoding="utf-8"
                        )
                except Exception:
                    pass

                courses = extract_courses_from_page(page)

                # Capture academic period from first successful tab
                if academic_period is None:
                    period = extract_academic_period(page)
                    if period:
                        academic_period = period
                        print(
                            f"      📅 Academic period: {period['start']} – {period['end']}"
                        )

                if courses:
                    years[class_year] = {
                        "label": f"Year {class_year}",
                        "courses": courses,
                    }
                    print(f"      ✓ Found {len(courses)} courses")
                else:
                    # Save screenshot for debugging
                    screenshot_path = debug_dir / f"year_{class_year}.png"
                    page.screenshot(path=str(screenshot_path), full_page=True)
                    print(
                        f"      ⚠️  No courses — screenshot saved to {screenshot_path}"
                    )
                    print(
                        f"      Try opening the URL manually to verify the page renders."
                    )

            except Exception as e:
                print(f"      ❌ Failed: {e}")
                try:
                    page.screenshot(
                        path=str(debug_dir / f"year_{class_year}_error.png")
                    )
                except Exception:
                    pass
            finally:
                page.close()

        browser.close()

    return years, academic_period


def main():
    year, semester = detect_semester()
    print("📡 Fetching CEI timetable from KMITL Regis...")
    print(f"   Auto-detected: Year {year}, Semester {semester}")
    if os.environ.get("REGIS_YEAR"):
        print(f"   (overridden via REGIS_YEAR/REGIS_SEMESTER env vars)")

    try:
        years, academic_period = scrape_with_playwright(year, semester)
    except ImportError:
        print("❌ playwright not installed.")
        print("   Install: pip install playwright && playwright install chromium")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Scraping failed: {e}")
        sys.exit(1)

    if not years:
        print("❌ No data extracted from any year tab.")
        print("   The regis page structure may have changed.")
        print("   Existing courses.json will NOT be overwritten.")
        sys.exit(1)

    output = {
        "semester": f"{semester}/{year}",
        "generated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": REGIS_BASE,
        "academic_period": academic_period,
        "years": years,
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    total = sum(len(y["courses"]) for y in years.values())
    print(f"\n✅ Saved {total} courses across {len(years)} years to {OUTPUT}")


if __name__ == "__main__":
    main()
