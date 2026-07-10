# CEI Resources

Central resources site for **Computer Engineering International (CEI)** at King Mongkut's Institute of Technology Ladkrabang (KMITL).

🔗 **[ttithipan.github.io/cei](https://ttithipan.github.io/cei)**

## Features

- **📅 Interactive Timetable** — Mon–Fri week view, course search + manual entries, ICS export, year tabs
- **⏰ Reminders** — Homework, exams, projects with countdown timers
- **📚 Course Cards** — Auto-filter to show only timetable-enrolled courses, with platform badges
- **🔍 Semantic Search** — BM25 + embeddings + title match + TF-IDF tag fusion with RRF, alias expansion, and typo correction
- **📄 Lecture Notes** — PDF-extracted markdown for Microcontroller, AI, OS, plus curriculum docs
- **🎨 Milk Matcha Theme** — Sakura pink + warm cream palette

## Project Structure

```
├── index.html              # Static SPA
├── css/style.css           # All styles, CSS variables for theming
├── js/
│   ├── app.js              # Main app, view switching, search UI
│   ├── search.js           # Search engine (BM25, embeddings, RRF, typo, aliases)
│   ├── timetable.js        # Calendar grid, popup, ICS export
│   ├── courses.js          # Course cards with platform info
│   └── reminders.js        # Deadline tracking
├── md/                     # Extracted lecture notes (markdown)
├── documents/              # Original PDFs
├── data/
│   ├── courses.json        # Timetable scraped from regis
│   ├── course_meta.json    # Platform info per course
│   ├── search_index.json   # Pre-computed search embeddings + tags
│   └── reminders.json      # Generated deadline data
├── ingest/                 # Drop PDFs + reminders.json here for pipeline
└── scripts/
    ├── ingest.py           # Full pipeline: sync meta, generate reminders, convert PDFs
    ├── pdf_to_md.py        # PDF → markdown extraction
    ├── build_index.py      # Chunk markdown, extract TF-IDF tags, build embeddings
    └── fetch_regis.py      # Scrape KMITL regis for timetable data (Playwright)
```

## Quick Start

```bash
# Serve locally
python3 -m http.server 8080

# Ingest new PDFs (rename to convention first, then run)
python scripts/ingest.py --docs-only

# Rebuild search after changing markdown
python scripts/build_index.py

# Fetch fresh timetable
pip install playwright && playwright install chromium
python scripts/fetch_regis.py
```

## Adding Content

1. **Add lecture PDFs:** Drop files into `ingest/`, rename to `{subject}-lec{NN}-{slug}-YYYYMMDD.pdf`, run `python scripts/ingest.py --docs-only`. Review the auto-generated `.md` in `md/`, fix formatting, then run `python scripts/build_index.py`.

2. **Add reminders:** Edit `ingest/reminders.json`, run `python scripts/ingest.py`.

3. **Add platform info:** Edit `data/course_meta.json` with platform, detail, and notes per course code.

## File Naming Convention

```
{subject}-lec{NN}-{slug}-{YYYYMMDD}.pdf
```
Examples: `microcontroller-lec03-gpio-20260630.pdf`, `ai-lec05-propositional-logic-20260630.pdf`, `os-lec01-introduction-20260630.pdf`

## Search Architecture

4-signal RRF fusion (k=15):

| Signal | What it catches |
|--------|----------------|
| BM25 | Exact keyword frequency × IDF |
| Embeddings | Semantic similarity (384-dim cosine) |
| Title match | Query tokens in chunk title/section |
| TF-IDF tags | Distinctive keywords per chunk |

Plus: comma-separated multi-query with RMS fusion, Levenshtein typo correction, abbreviation expansion (50+ aliases for GPIO, I²C, ADC, etc.)

## Known Issues

- **Mac trackpad overscroll** — elastic scrolling on macOS may briefly reveal the pink page background above the fixed header. The `html` element background is set to match the header color as a workaround, but the effect is not fully eliminated on all browsers.
- **ICS export** — the UNTIL date depends on final exam data from `courses.json`. If exam dates are missing, the fallback is `today + 5 months` which may overshoot into finals week.
