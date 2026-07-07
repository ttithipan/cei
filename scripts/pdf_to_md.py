#!/usr/bin/env python3
"""
Convert PDF documents to clean Markdown for the CEI Resources site.

Extracts text from PDF, attempts to preserve structure (headings, lists,
tables), and writes the result to md/. After conversion, re-run
build_index.py to update the search index.

Usage:
    python scripts/pdf_to_md.py documents/myfile.pdf

Dependencies:
    pip install pymupdf
"""

import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD_DIR = ROOT / "md"


def extract_text_with_pymupdf(pdf_path: Path) -> str:
    """Extract text from PDF using PyMuPDF (fast, good layout preservation)."""
    import fitz  # pymupdf

    doc = fitz.open(str(pdf_path))
    pages = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        pages.append(text)

    doc.close()
    return "\n\n".join(pages)


def extract_text_with_pdfplumber(pdf_path: Path) -> str:
    """Fallback: extract text using pdfplumber (better table detection)."""
    import pdfplumber

    pages = []
    with pdfplumber.open(str(pdf_path)) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                pages.append(text)

            # Attempt table extraction
            tables = page.extract_tables()
            for table in tables:
                if table:
                    pages.append(format_table_as_markdown(table))

    return "\n\n".join(pages)


def format_table_as_markdown(table: list[list[str | None]]) -> str:
    """Convert extracted table to GitHub-flavored Markdown table."""
    if not table:
        return ""

    # Filter out fully empty rows
    table = [row for row in table if row and any(cell for cell in row)]

    if not table:
        return ""

    lines = []
    # Header
    header = [str(cell or "") for cell in table[0]]
    lines.append("| " + " | ".join(header) + " |")
    lines.append("| " + " | ".join(["---"] * len(header)) + " |")

    # Body
    for row in table[1:]:
        cells = [str(cell or "").replace("\n", " ") for cell in row]
        # Pad to match header length
        while len(cells) < len(header):
            cells.append("")
        lines.append("| " + " | ".join(cells[: len(header)]) + " |")

    return "\n".join(lines)


def clean_text(text: str, filename: str) -> str:
    """
    Clean extracted text and add a title heading.
    Attempts to detect section headings heuristically.
    """
    lines = text.split("\n")
    cleaned = []

    # Add title from filename
    title = filename.replace("-", " ").replace("_", " ").title()
    cleaned.append(f"# {title}")
    cleaned.append("")
    cleaned.append(f"> Extracted from PDF — {filename}")
    cleaned.append("")

    prev_blank = False

    for line in lines:
        stripped = line.strip()

        # Skip empty lines (but collapse multiple blanks)
        if not stripped:
            if not prev_blank:
                cleaned.append("")
                prev_blank = True
            continue
        prev_blank = False

        # Detect all-caps short lines as potential headings
        if len(stripped) < 80 and stripped.isupper() and len(stripped.split()) <= 10:
            cleaned.append(f"## {stripped.title()}")
            cleaned.append("")
            continue

        # Detect numbered sections like "1. Something" or "1.0 Something"
        if re.match(r"^\d+(\.\d+)*\s{1,3}[A-Z]", stripped):
            cleaned.append(f"## {stripped}")
            cleaned.append("")
            continue

        # Detect lines that look like list items
        if re.match(r"^[\-\•\*\✓\✔]\s", stripped):
            cleaned.append(f"- {stripped[1:].strip()}")
            continue

        # Detect lines starting with numbers followed by period (ordered list)
        if re.match(r"^\d+\.\s", stripped):
            cleaned.append(stripped)
            continue

        cleaned.append(stripped)

    # Remove excessive blank lines (more than 2 consecutive)
    result = []
    blank_count = 0
    for line in cleaned:
        if line == "":
            blank_count += 1
            if blank_count <= 2:
                result.append(line)
        else:
            blank_count = 0
            result.append(line)

    return "\n".join(result)


def extract_text_with_ocr(pdf_path: Path) -> str:
    """OCR fallback for scanned/image-based PDFs using pytesseract + pdf2image."""
    try:
        import pytesseract
        from pdf2image import convert_from_path
    except ImportError:
        print("   OCR requires: pip install pytesseract pdf2image")
        print("   Also install tesseract: brew install tesseract")
        return ""

    print("   Converting PDF pages to images for OCR...")
    try:
        images = convert_from_path(str(pdf_path), dpi=300)
    except Exception as e:
        print(f"   pdf2image failed: {e}")
        return ""

    pages = []
    for i, img in enumerate(images):
        print(f"   OCR page {i + 1}/{len(images)}...")
        try:
            text = pytesseract.image_to_string(img, lang="eng+tha")
            if text.strip():
                pages.append(text)
        except Exception as e:
            print(f"   OCR failed on page {i + 1}: {e}")

    return "\n\n".join(pages)


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/pdf_to_md.py <path/to/file.pdf>")
        print("Example: python scripts/pdf_to_md.py documents/orientation-y3.pdf")
        sys.exit(1)

    pdf_path = Path(sys.argv[1])
    if not pdf_path.exists():
        print(f"❌ File not found: {pdf_path}")
        sys.exit(1)

    if pdf_path.suffix.lower() != ".pdf":
        print(f"❌ Not a PDF file: {pdf_path}")
        sys.exit(1)

    filename = pdf_path.stem
    out_path = MD_DIR / f"{filename}.md"

    print(f"📄 Extracting: {pdf_path}")

    # Try PyMuPDF first, fall back to pdfplumber
    text = None
    extractor = "pymupdf"

    try:
        text = extract_text_with_pymupdf(pdf_path)
    except ImportError:
        print("   pymupdf not installed, trying pdfplumber...")
        try:
            text = extract_text_with_pdfplumber(pdf_path)
            extractor = "pdfplumber"
        except ImportError:
            print("❌ Neither pymupdf nor pdfplumber is installed.")
            print("   Install one: pip install pymupdf  (recommended)")
            print("            or: pip install pdfplumber")
            sys.exit(1)
    except Exception as e:
        print(f"   pymupdf failed: {e}, trying pdfplumber...")
        try:
            text = extract_text_with_pdfplumber(pdf_path)
            extractor = "pdfplumber"
        except ImportError:
            print("❌ pdfplumber is not installed.")
            print("   Install: pip install pdfplumber")
            sys.exit(1)
        except Exception as e2:
            print(f"❌ Both extractors failed. Last error: {e2}")
            sys.exit(1)

    if not text or not text.strip():
        print("⚠️  No text extracted — PDF may be scanned/image-based.")
        print("   Attempting OCR with pytesseract...")
        text = extract_text_with_ocr(pdf_path)
        if not text or not text.strip():
            print("❌ OCR also failed. The PDF could not be processed.")
            print("   Install tesseract: brew install tesseract")
            print("   Then: pip install pytesseract pdf2image")
            sys.exit(1)
        extractor = "ocr (pytesseract)"

    # Clean and format
    md_content = clean_text(text, pdf_path.name)

    # Ensure md directory exists
    MD_DIR.mkdir(parents=True, exist_ok=True)

    # Write output
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    print(f"✅ Markdown written to: {out_path}")
    print(f"   Extractor used: {extractor}")
    print(f"   Lines: {len(md_content.splitlines())}")
    print()
    print("📌 Next step: Review the markdown and fix any formatting issues.")
    print("   Then run: python scripts/build_index.py")
    print("   to update the search index with the new document.")


if __name__ == "__main__":
    main()
