# CEI Resources

Central resources site for **Computer Engineering International (CEI)** at King Mongkut's Institute of Technology Ladkrabang (KMITL).

🔗 **[ttithipan.github.io/cei](https://ttithipan.github.io/cei)**

## Features

- **📅 Interactive Timetable** — Google Calendar-style weekly view with course selection, manual entries, and ICS export
- **📚 Curriculum Browser** — Full 2022 curriculum document with search across all sections
- **🔍 Semantic Search** — BM25 + embedding-based search across curriculum and resources
- **📝 Exam Schedule** — Midterm and final exam dates per course

## Running Locally

```bash
# Serve static files (any HTTP server works)
python3 -m http.server 8080
# → http://localhost:8080
```

No build step — pure static HTML/CSS/JS.

## Scripts

| Script | Purpose |
|---|---|
| `scripts/fetch_regis.py` | Scrapes KMITL regis site for timetable data using Playwright |
| `scripts/build_index.py` | Builds search index from markdown files using sentence-transformers |

### Fetching timetable data

```bash
pip install playwright && playwright install chromium
python scripts/fetch_regis.py
# Output: data/courses.json
```

Runs automatically via GitHub Actions every Monday.

### Building search index

```bash
pip install -r requirements.txt
python scripts/build_index.py
# Output: data/search_index.json
```

## Data

- `data/courses.json` — timetable scraped from regis (auto-updated weekly)
- `data/search_index.json` — pre-computed search embeddings (rebuild after md changes)
- `md/` — curriculum markdown files

## Known Issues

- **ICS export may extend into exam period**: The RRULE `UNTIL` depends on `academic_period.end` from `courses.json`. If the regis scraper fails to extract the class period, the fallback is `today + 5 months` which may overshoot into finals. Fix pending: the scraper needs a reliable selector for the academic calendar date range on the regis page.
- **Timetable lab courses**: Theory + lab sections sharing the same course code were not distinguishable in popup selection (fixed — now matches by `code` + `kind`).
