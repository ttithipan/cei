#!/usr/bin/env python3
"""
Build search index for CEI Resources static site.

Reads markdown files from md/, chunks them by section headings,
extracts TF-IDF tags, auto-discovers abbreviations/aliases, and outputs
a compact search_index.json for client-side BM25 + tag fusion search.

No embeddings — the index is ~300 KB and loads near-instantly.

Usage:
    python scripts/build_index.py
"""

import json
import math
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD_DIR = ROOT / "md"
DOCS_DIR = ROOT / "documents"
DATA_DIR = ROOT / "data"
LLMS_TXT = ROOT / "llms.txt"
BASE_URL = "https://ttithipan.github.io/cei"

# ── Configuration ───────────────────────────────────────────────────
CHUNK_MIN_CHARS = 80
CHUNK_MAX_CHARS = 1500
TAGS_PER_CHUNK = 8

STOP_WORDS = {
    "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
    "have", "has", "had", "do", "does", "did", "will", "would", "could",
    "should", "may", "might", "can", "shall", "to", "of", "in", "for",
    "on", "with", "at", "by", "from", "as", "into", "through", "during",
    "before", "after", "above", "below", "between", "under", "and", "but",
    "or", "not", "no", "if", "then", "else", "when", "where", "which",
    "who", "whom", "this", "that", "these", "those", "it", "its", "he",
    "she", "they", "we", "you", "all", "each", "every", "both", "few",
    "more", "most", "other", "some", "such", "only", "own", "same", "so",
    "than", "too", "very", "just", "about", "also", "here", "there",
    "using", "used", "use", "one", "two", "see", "example", "note",
    "page", "slide", "pdf", "figure", "following", "way", "like", "well",
    "much", "many", "however", "therefore", "since", "while", "called",
    "known", "typically", "often", "usually", "generally",
}


# ── Tokenizer ───────────────────────────────────────────────────────
def tokenize(text: str) -> list[str]:
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    return [t for t in text.split() if len(t) > 1]


# ── Alias / Abbreviation Discovery ──────────────────────────────────
def discover_aliases(md_files: list[Path]) -> dict[str, str]:
    """
    Scan markdown for abbreviation patterns.
    Returns { "abbrev_lower": "expansion" }
    """
    aliases = {}

    bold_def = re.compile(r"\*\*(.+?)\*\*\s*[—–-]\s*(.+)")
    paren_def = re.compile(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,6})\s+\(([A-Z]{2,8})\)")

    for md_path in md_files:
        content = md_path.read_text(encoding="utf-8")
        for match in bold_def.finditer(content):
            term = match.group(1).strip()
            definition = match.group(2).strip().rstrip(".")
            if len(term) <= 12 and len(term) >= 2 and len(definition) > len(term):
                aliases[term.lower()] = definition.lower()

        for match in paren_def.finditer(content):
            full = match.group(1).strip().lower()
            abbr = match.group(2).strip().lower()
            if len(abbr) >= 2 and len(full) > len(abbr):
                aliases[abbr] = full

    # Manual overrides for common tech terms
    manual = {
        "os": "operating system",
        "cpu": "central processing unit",
        "ram": "random access memory",
        "gpu": "graphics processing unit",
        "vm": "virtual machine",
        "api": "application programming interface",
        "sdk": "software development kit",
        "ide": "integrated development environment",
        "db": "database",
        "ui": "user interface",
        "ux": "user experience",
        "pc": "personal computer",
        "ai": "artificial intelligence",
        "ml": "machine learning",
        "dl": "deep learning",
        "nlp": "natural language processing",
        "ann": "artificial neural network",
        "ga": "genetic algorithm",
        "rtos": "real time operating system",
        "hal": "hardware abstraction layer",
        "mcu": "microcontroller unit",
        "pcb": "printed circuit board",
        "ic": "integrated circuit",
        "led": "light emitting diode",
        "lcd": "liquid crystal display",
        "i2c": "inter integrated circuit",
        "spi": "serial peripheral interface",
        "uart": "universal asynchronous receiver transmitter",
        "gpio": "general purpose input output",
        "pwm": "pulse width modulation",
        "adc": "analog to digital converter",
        "dac": "digital to analog converter",
        "fsm": "finite state machine",
        "mmu": "memory management unit",
        "mpu": "memory protection unit",
        "fpu": "floating point unit",
        "alu": "arithmetic logic unit",
        "risc": "reduced instruction set computer",
        "cisc": "complex instruction set computer",
        "arm": "advanced risc machine",
        "nvic": "nested vector interrupt controller",
        "sram": "static random access memory",
        "dram": "dynamic random access memory",
        "eeprom": "electrically erasable programmable read only memory",
        "sdram": "synchronous dynamic random access memory",
        "dimm": "dual inline memory module",
        "cei": "computer engineering international",
        "kmitl": "king mongkuts institute of technology ladkrabang",
        "io": "input output",
    }
    for k, v in manual.items():
        aliases[k] = v

    return aliases


# ── Markdown Chunking ───────────────────────────────────────────────
def chunk_markdown(content: str, source_path: str) -> list[dict]:
    lines = content.split("\n")
    chunks = []
    current_title = Path(source_path).stem.replace("-", " ").title()
    current_section = ""
    current_text = []

    for line in lines:
        heading_match = re.match(r"^(#{1,4})\s+(.+)$", line)
        if heading_match:
            text = "\n".join(current_text).strip()
            if len(text) >= CHUNK_MIN_CHARS:
                for sub in split_long(text, CHUNK_MAX_CHARS):
                    chunks.append({
                        "title": current_title,
                        "section": current_section,
                        "text": sub,
                    })
            current_text = []
            current_section = heading_match.group(2).strip()
            current_text.append(line)
        else:
            current_text.append(line)

    text = "\n".join(current_text).strip()
    if len(text) >= CHUNK_MIN_CHARS:
        for sub in split_long(text, CHUNK_MAX_CHARS):
            chunks.append({
                "title": current_title,
                "section": current_section,
                "text": sub,
            })
    return chunks


def split_long(text: str, max_chars: int) -> list[str]:
    if len(text) <= max_chars:
        return [text]

    paragraphs = text.split("\n\n")
    chunks = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) < max_chars:
            current = (current + "\n\n" + para).strip()
        else:
            if current:
                chunks.append(current)
            if len(para) > max_chars:
                sentences = re.split(r"(?<=[.!?])\s+", para)
                current = ""
                for sent in sentences:
                    if len(current) + len(sent) < max_chars:
                        current = (current + " " + sent).strip()
                    else:
                        if current:
                            chunks.append(current)
                        current = sent
                if current:
                    chunks.append(current)
                current = ""
            else:
                current = para
    if current:
        chunks.append(current)

    return [c for c in chunks if len(c) >= CHUNK_MIN_CHARS]


# ── Keyword/Tag Extraction ──────────────────────────────────────────
def extract_tags(text: str, all_chunks: list[dict], n: int = TAGS_PER_CHUNK) -> list[str]:
    tokens = tokenize(text)
    if not tokens:
        return []

    tf = {}
    for t in tokens:
        if t in STOP_WORDS or len(t) < 3:
            continue
        tf[t] = tf.get(t, 0) + 1
    if not tf:
        return []

    df = {}
    for chunk in all_chunks:
        seen = set()
        for t in chunk.get("tokens", []):
            if t in tf and t not in seen:
                df[t] = df.get(t, 0) + 1
                seen.add(t)

    N = max(len(all_chunks), 1)
    scores = {}
    for word, freq in tf.items():
        idf = math.log((N + 1) / (df.get(word, 0) + 1))
        scores[word] = freq * idf

    ranked = sorted(scores.items(), key=lambda x: -x[1])
    return [word for word, _ in ranked[:n]]


# ── Date Extraction ──────────────────────────────────────────────────
def extract_date_from_filename(filename: str) -> str | None:
    stem = Path(filename).stem
    m = re.search(r"(\d{4})(\d{2})(\d{2})", stem)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", stem)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    return None


# ── llms.txt Generator ───────────────────────────────────────────────
def generate_llms_txt(documents: list[dict]):
    lines = [
        "# CEI3 — Document Index for AI Agents",
        f"# Base URL: {BASE_URL}",
        "",
        "## Markdown Notes",
    ]
    for doc in documents:
        lines.append(f"- [{doc['title']}](/{doc['path']})")

    lines.append("")
    lines.append("## PDF Sources")
    if DOCS_DIR.exists():
        for pdf in sorted(DOCS_DIR.glob("*.pdf")):
            rel = str(pdf.relative_to(ROOT))
            lines.append(f"- [{pdf.name}](/{rel})")

    LLMS_TXT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"   llms.txt → {LLMS_TXT}")


# ── Main Build ──────────────────────────────────────────────────────
def main():
    print(f"📂 Reading markdown files from: {MD_DIR}")

    if not MD_DIR.exists():
        print(f"❌ Directory not found: {MD_DIR}")
        sys.exit(1)

    md_files = sorted(MD_DIR.glob("*.md"))
    if not md_files:
        print(f"❌ No markdown files found in {MD_DIR}")
        sys.exit(1)

    print(f"   Found {len(md_files)} file(s)")

    # ── Discover aliases ─────────────────────────────────────────
    print("🔍 Discovering abbreviations and aliases...")
    aliases = discover_aliases(md_files)
    print(f"   Found {len(aliases)} alias(es)")

    # ── Parse documents and chunk ────────────────────────────────
    documents = []
    all_chunks = []
    valid_courses = set()

    for i, md_path in enumerate(md_files):
        rel_path = str(md_path.relative_to(ROOT))
        content = md_path.read_text(encoding="utf-8")

        title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        title = (
            title_match.group(1).strip()
            if title_match
            else md_path.stem.replace("-", " ").title()
        )

        doc_date = extract_date_from_filename(md_path.name)
        if not doc_date:
            from datetime import datetime, timezone
            doc_date = datetime.fromtimestamp(
                md_path.stat().st_mtime, tz=timezone.utc
            ).strftime("%Y-%m-%d")

        # Extract course prefix from filename stem: "os-lec02-..." → "os"
        stem = md_path.stem
        course = stem.split("-")[0] if "-" in stem else stem
        valid_courses.add(course)

        # Path tokens for multi-field weighting (repeated 3× for TF boost)
        path_tokens = tokenize(stem)

        doc_id = f"doc_{i}"
        documents.append({
            "id": doc_id,
            "title": title,
            "path": rel_path,
            "date": doc_date,
            "course": course,
        })

        chunks = chunk_markdown(content, rel_path)
        for j, chunk in enumerate(chunks):
            chunk_id = f"{doc_id}_c{j}"
            chunk_text = chunk["text"]
            tokens = tokenize(chunk_text)
            # Prepend path tokens 3× for ~3× BM25 TF boost on path matches
            tokens = path_tokens * 3 + tokens
            all_chunks.append({
                "id": chunk_id,
                "doc_id": doc_id,
                "title": chunk["title"],
                "section": chunk["section"],
                "content": chunk_text,
                "tokens": tokens,
            })

    print(f"   Created {len(all_chunks)} chunks from {len(documents)} document(s)")

    # ── Extract tags ─────────────────────────────────────────────
    print(f"   Extracting keywords...")
    for chunk in all_chunks:
        chunk["tags"] = extract_tags(chunk["content"], all_chunks)

    # ── Build and write index ────────────────────────────────────
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    index = {
        "version": "3.0",
        "valid_courses": sorted(valid_courses),
        "documents": documents,
        "chunks": all_chunks,
        "aliases": aliases,
    }

    output_path = DATA_DIR / "search_index.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    size_kb = output_path.stat().st_size / 1024
    print(f"\n✅ Search index written to: {output_path}")
    print(f"   Size: {size_kb:.1f} KB")
    print(f"   Documents: {len(documents)}")
    print(f"   Chunks: {len(all_chunks)}")
    print(f"   Aliases: {len(aliases)}")
    print(f"   Valid courses: {sorted(valid_courses)}")

    # ── Generate llms.txt ────────────────────────────────────────
    generate_llms_txt(documents)


if __name__ == "__main__":
    main()
