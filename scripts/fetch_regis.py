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
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
    "mon": 0,
    "tue": 1,
    "wed": 2,
    "thu": 3,
    "fri": 4,
    "sat": 5,
    "sun": 6,
    "จันทร์": 0,
    "อังคาร": 1,
    "พุธ": 2,
    "พฤหัส": 3,
    "ศุกร์": 4,
    "เสาร์": 5,
    "อาทิตย์": 6,
    "จ.": 0,
    "อ.": 1,
    "พ.": 2,
    "พฤ.": 3,
    "ศ.": 4,
    "ส.": 5,
    "อา.": 6,
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
    """Parse day string to 0-based index (Mon=0)."""
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


def extract_courses_from_page(page) -> list[dict]:
    """
    Try to extract course rows from the rendered regis page.
    The page renders a table — we look for table rows with course data.
    """
    courses = []

    try:
        # Wait for the table to render
        page.wait_for_selector("table", timeout=15000)

        # Try to extract from table rows
        rows = page.locator("table tbody tr").all()
        if not rows:
            rows = page.locator("table tr").all()

        for row in rows:
            cells = row.locator("td, th").all()
            texts = [c.inner_text().strip() for c in cells]

            if len(texts) < 3:
                continue

            # Skip header rows
            if any(t.lower() in ("day", "time", "course", "room") for t in texts):
                continue

            # Try to parse a course row
            # Common format: Day | Time | Course Code | Course Name | Section | Room | Lecturer
            course = {}
            for t in texts:
                # Detect day
                day = parse_day(t)
                if day is not None:
                    course["day"] = day
                    continue

                # Detect time range
                times = parse_time_range(t)
                if times:
                    course["start"], course["end"] = times
                    continue

                # Detect course code (digits)
                if re.match(r"^\d{8}$", t):
                    course["code"] = t
                    continue

                # Detect room
                if re.match(r"^[A-Z]+[-.\d]+", t) or t.upper() in ("TBA", "N/A"):
                    course["room"] = t
                    continue

                # Remaining: likely name or teacher
                if "name" not in course and len(t) > 2:
                    course["name"] = t
                elif "teacher" not in course and len(t) > 2:
                    course["teacher"] = t

            if course.get("name") and course.get("day") is not None:
                course.setdefault("code", None)
                course.setdefault("section", None)
                course.setdefault("kind", "theory")
                course.setdefault("room", None)
                course.setdefault("teacher", None)
                course.setdefault("credit", None)
                course.setdefault("tag", None)
                course.setdefault("midterm", None)
                course.setdefault("final", None)
                courses.append(course)

    except Exception as e:
        print(f"   ⚠️  Table extraction failed: {e}")

    return courses


def scrape_with_playwright(year: str, semester: str) -> dict:
    """Scrape all year tabs using Playwright."""
    from playwright.sync_api import sync_playwright

    years = {}

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
                page.goto(url, wait_until="networkidle", timeout=30000)
                # Wait for Angular to render
                page.wait_for_timeout(3000)

                courses = extract_courses_from_page(page)

                if courses:
                    years[class_year] = {
                        "label": f"Year {class_year}",
                        "courses": courses,
                    }
                    print(f"      ✓ Found {len(courses)} courses")
                else:
                    print(
                        f"      ⚠️  No courses extracted — page structure may have changed"
                    )

            except Exception as e:
                print(f"      ❌ Failed: {e}")
            finally:
                page.close()

        browser.close()

    return years


def main():
    year, semester = detect_semester()
    print("📡 Fetching CEI timetable from KMITL Regis...")
    print(f"   Auto-detected: Year {year}, Semester {semester}")
    if os.environ.get("REGIS_YEAR"):
        print(f"   (overridden via REGIS_YEAR/REGIS_SEMESTER env vars)")

    try:
        years = scrape_with_playwright(year, semester)
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
        "years": years,
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    total = sum(len(y["courses"]) for y in years.values())
    print(f"\n✅ Saved {total} courses across {len(years)} years to {OUTPUT}")


if __name__ == "__main__":
    main()
