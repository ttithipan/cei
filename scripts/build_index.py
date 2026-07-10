#!/usr/bin/env python3
"""
Build search index for CEI Resources static site.

Reads markdown files from md/, chunks them by section headings,
generates embeddings using sentence-transformers, and outputs
a search_index.json for client-side ensemble search (BM25 + cosine similarity).

Usage:
    pip install sentence-transformers
    python scripts/build_index.py
"""

import json
import math
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD_DIR = ROOT / "md"
DATA_DIR = ROOT / "data"

# ── Configuration ───────────────────────────────────────────────────
CHUNK_MIN_CHARS = 80  # Minimum chars for a chunk to be indexed
CHUNK_MAX_CHARS = 1500  # Soft max — split long chunks
EMBEDDING_MODEL = "all-MiniLM-L6-v2"  # Small, fast, good quality (384-dim)
TAGS_PER_CHUNK = 8  # Number of keywords to extract per chunk

# Common English stop words — filtered out of tags
STOP_WORDS = {
    "a",
    "an",
    "the",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "can",
    "shall",
    "to",
    "of",
    "in",
    "for",
    "on",
    "with",
    "at",
    "by",
    "from",
    "as",
    "into",
    "through",
    "during",
    "before",
    "after",
    "above",
    "below",
    "between",
    "under",
    "and",
    "but",
    "or",
    "not",
    "no",
    "if",
    "then",
    "else",
    "when",
    "where",
    "which",
    "who",
    "whom",
    "this",
    "that",
    "these",
    "those",
    "it",
    "its",
    "he",
    "she",
    "they",
    "we",
    "you",
    "all",
    "each",
    "every",
    "both",
    "few",
    "more",
    "most",
    "other",
    "some",
    "such",
    "only",
    "own",
    "same",
    "so",
    "than",
    "too",
    "very",
    "just",
    "about",
    "also",
    "here",
    "there",
    "using",
    "used",
    "use",
    "one",
    "two",
    "see",
    "example",
    "note",
    "page",
    "slide",
    "pdf",
    "figure",
    "following",
    "way",
    "like",
    "well",
    "much",
    "many",
    "however",
    "therefore",
    "since",
    "while",
}


# ── Tokenizer ───────────────────────────────────────────────────────
def tokenize(text: str) -> list[str]:
    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    return [t for t in text.split() if len(t) > 1]


# ── Markdown Chunking ───────────────────────────────────────────────
def chunk_markdown(content: str, source_path: str) -> list[dict]:
    """
    Split markdown content into chunks by headings.
    Each chunk is a section with its heading as title.
    """
    lines = content.split("\n")
    chunks = []
    current_title = Path(source_path).stem.replace("-", " ").title()
    current_section = ""
    current_text = []

    for line in lines:
        # Detect headings
        heading_match = re.match(r"^(#{1,4})\s+(.+)$", line)
        if heading_match:
            # Save previous chunk
            text = "\n".join(current_text).strip()
            if len(text) >= CHUNK_MIN_CHARS:
                # Split long chunks
                for sub in split_long(text, CHUNK_MAX_CHARS):
                    chunks.append(
                        {
                            "title": current_title,
                            "section": current_section,
                            "text": sub,
                        }
                    )
            current_text = []
            level = len(heading_match.group(1))
            heading_text = heading_match.group(2).strip()
            if level <= 2:
                current_section = heading_text
            else:
                current_section = heading_text
            current_text.append(line)
        else:
            current_text.append(line)

    # Save final chunk
    text = "\n".join(current_text).strip()
    if len(text) >= CHUNK_MIN_CHARS:
        for sub in split_long(text, CHUNK_MAX_CHARS):
            chunks.append(
                {
                    "title": current_title,
                    "section": current_section,
                    "text": sub,
                }
            )

    return chunks


def split_long(text: str, max_chars: int) -> list[str]:
    """Split long text into smaller overlapping chunks at paragraph boundaries."""
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
            # If a single paragraph is too long, split by sentences
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
def extract_tags(
    text: str, all_chunks: list[dict], n: int = TAGS_PER_CHUNK
) -> list[str]:
    """Extract the most distinctive keywords from a chunk using TF-IDF.

    Words that appear frequently in this chunk but rarely across all chunks
    get high scores. Stop words and short tokens are filtered.
    """
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

    # Document frequency across all chunks
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


# ── Extract vocabulary for token embeddings ─────────────────────────
def build_vocabulary(chunks: list[dict], max_vocab: int = 2000) -> dict[str, int]:
    """Collect most frequent tokens across all chunks."""
    freq = {}
    for chunk in chunks:
        seen = set()
        for token in tokenize(chunk["content"]):
            if token not in seen:
                freq[token] = freq.get(token, 0) + 1
                seen.add(token)

    # Sort by frequency, take top N
    sorted_tokens = sorted(freq.items(), key=lambda x: -x[1])[:max_vocab]
    return {token: idx for idx, (token, _) in enumerate(sorted_tokens)}


# ── Main Build ──────────────────────────────────────────────────────
def extract_date_from_filename(filename: str) -> str | None:
    """Try to extract a date from a filename like 2024-01-15-topic.md or topic-20260706.md."""
    stem = Path(filename).stem
    m = re.search(r"(\d{4})-(\d{2})-(\d{2})", stem)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    m = re.search(r"(\d{4})(\d{2})(\d{2})", stem)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    return None


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

    # Parse documents and chunk
    documents = []
    all_chunks = []

    for i, md_path in enumerate(md_files):
        rel_path = str(md_path.relative_to(ROOT))
        content = md_path.read_text(encoding="utf-8")

        # Extract first heading as title
        title_match = re.search(r"^#\s+(.+)$", content, re.MULTILINE)
        title = (
            title_match.group(1).strip()
            if title_match
            else md_path.stem.replace("-", " ").title()
        )

        # Extract date from filename (e.g. 2024-01-15-something.md) or fall back to mtime
        doc_date = extract_date_from_filename(md_path.name) or datetime.fromtimestamp(
            md_path.stat().st_mtime, tz=timezone.utc
        ).strftime("%Y-%m-%d")

        doc_id = f"doc_{i}"
        documents.append(
            {
                "id": doc_id,
                "title": title,
                "path": rel_path,
                "date": doc_date,
            }
        )

        chunks = chunk_markdown(content, rel_path)
        for j, chunk in enumerate(chunks):
            chunk_id = f"{doc_id}_c{j}"
            chunk_text = chunk["text"]
            tokens = tokenize(chunk_text)

            all_chunks.append(
                {
                    "id": chunk_id,
                    "doc_id": doc_id,
                    "title": chunk["title"],
                    "section": chunk["section"],
                    "content": chunk_text,
                    "tokens": tokens,
                }
            )

    print(f"   Created {len(all_chunks)} chunks from {len(documents)} document(s)")

    # ── Extract tags (TF-IDF keywords per chunk) ─────────────────────
    print(f"   Extracting keywords...")
    for chunk in all_chunks:
        chunk["tags"] = extract_tags(chunk["content"], all_chunks)

    # ── Generate embeddings ─────────────────────────────────────────
    print(f"\n🧠 Loading embedding model: {EMBEDDING_MODEL}")
    try:
        from sentence_transformers import SentenceTransformer

        model = SentenceTransformer(EMBEDDING_MODEL)
    except ImportError:
        print("⚠️  sentence-transformers not installed.")
        print("   Install with: pip install sentence-transformers")
        print("   Falling back to keyword-only search (no semantic embeddings).")
        model = None
    except Exception as e:
        print(f"⚠️  Could not load model: {e}")
        print("   Falling back to keyword-only search.")
        model = None

    embedding_dim = 384  # all-MiniLM-L6-v2 dimension

    if model:
        # Embed all chunks
        texts = [c["content"] for c in all_chunks]
        print(f"   Encoding {len(texts)} chunks...")
        embeddings = model.encode(
            texts, show_progress_bar=True, normalize_embeddings=True
        )

        for i, chunk in enumerate(all_chunks):
            chunk["embedding"] = embeddings[i].tolist()

        # Build token-level embeddings for query-side approximation
        print("   Building token embeddings...")
        vocab = build_vocabulary(all_chunks, max_vocab=2000)
        token_texts = list(vocab.keys())
        token_embeddings_arr = model.encode(
            token_texts, show_progress_bar=True, normalize_embeddings=True
        )

        token_embeddings = {}
        for token, emb in zip(token_texts, token_embeddings_arr):
            token_embeddings[token] = emb.tolist()

        print(f"   Created {len(token_embeddings)} token embeddings")
    else:
        # No embeddings — mark as None
        for chunk in all_chunks:
            chunk["embedding"] = None

        token_embeddings = {}

    # ── Build and write index ───────────────────────────────────────
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    index = {
        "version": "1.0",
        "embeddings_model": EMBEDDING_MODEL if model else None,
        "embedding_dim": embedding_dim if model else 0,
        "documents": documents,
        "chunks": all_chunks,
        "token_embeddings": token_embeddings,
        "query_embedding_fn": "token_average" if model else None,
    }

    # Remove embedding data from chunks if None (save space)
    if not model:
        for chunk in index["chunks"]:
            chunk.pop("embedding", None)

    output_path = DATA_DIR / "search_index.json"
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(index, f, ensure_ascii=False, indent=2)

    # Report file size
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"\n✅ Search index written to: {output_path}")
    print(f"   Size: {size_mb:.2f} MB")
    print(f"   Documents: {len(documents)}")
    print(f"   Chunks: {len(all_chunks)}")
    print(f"   Embedding model: {EMBEDDING_MODEL if model else 'None (keyword-only)'}")


if __name__ == "__main__":
    main()
