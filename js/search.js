/**
 * CEI Search Engine
 * Ensemble: BM25 (keyword) + Cosine Similarity (semantic embeddings) + RRF fusion
 */

const SearchEngine = (() => {
  let index = null; // The loaded search index
  let ready = false;

  // ── Time decay ──────────────────────────────────────────────────
  // Half-life in days: after this many days, relevance halves.
  // Default 365 = 1 year. Set to Infinity to disable decay.
  const DECAY_HALF_LIFE_DAYS = 365;

  function computeDecay(dateStr) {
    if (!dateStr || !isFinite(DECAY_HALF_LIFE_DAYS)) return 1.0;
    const docDate = new Date(dateStr);
    const now = new Date();
    const ageDays = (now - docDate) / (1000 * 60 * 60 * 24);
    if (ageDays <= 0) return 1.0;
    // Exponential decay: score * 0.5^(age / halfLife)
    return Math.pow(0.5, ageDays / DECAY_HALF_LIFE_DAYS);
  }

  // ── BM25 Implementation ──────────────────────────────────────────
  const BM25_K1 = 1.5;
  const BM25_B = 0.75;

  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1);
  }

  class BM25 {
    constructor(chunks) {
      this.N = chunks.length;
      this.avgdl =
        chunks.reduce((s, c) => s + c.tokens.length, 0) / Math.max(1, this.N);
      this.docs = chunks.map((c) => ({
        id: c.id,
        tokens: c.tokens,
        tf: buildTF(c.tokens),
      }));
      this.df = {};
      for (const doc of this.docs) {
        const seen = new Set();
        for (const term of Object.keys(doc.tf)) {
          if (!seen.has(term)) {
            this.df[term] = (this.df[term] || 0) + 1;
            seen.add(term);
          }
        }
      }
    }

    score(queryTokens) {
      const scores = [];
      for (const doc of this.docs) {
        let s = 0;
        const dl = doc.tokens.length;
        for (const term of queryTokens) {
          const n = this.df[term] || 0;
          if (n === 0) continue;
          const f = doc.tf[term] || 0;
          const idf = Math.log((this.N - n + 0.5) / (n + 0.5) + 1);
          const numerator = f * (BM25_K1 + 1);
          const denominator =
            f + BM25_K1 * (1 - BM25_B + BM25_B * (dl / this.avgdl));
          s += idf * (numerator / denominator);
        }
        scores.push({ id: doc.id, score: s });
      }
      return scores.sort((a, b) => b.score - a.score);
    }
  }

  function buildTF(tokens) {
    const tf = {};
    for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
    return tf;
  }

  // ── Cosine Similarity (embeddings) ───────────────────────────────
  function dot(a, b) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * b[i];
    return s;
  }

  function norm(a) {
    let s = 0;
    for (let i = 0; i < a.length; i++) s += a[i] * a[i];
    return Math.sqrt(s);
  }

  function cosineSimilarity(a, b) {
    const na = norm(a);
    const nb = norm(b);
    if (na === 0 || nb === 0) return 0;
    return dot(a, b) / (na * nb);
  }

  function embeddingSearch(queryEmbedding, chunks) {
    return chunks
      .map((c) => ({
        id: c.id,
        score: cosineSimilarity(queryEmbedding, c.embedding),
      }))
      .filter((r) => r.score > 0.15)
      .sort((a, b) => b.score - a.score);
  }

  // ── Reciprocal Rank Fusion (RRF) ─────────────────────────────────
  function rrf(rankings, k = 60) {
    const scoreMap = {};
    for (const ranking of rankings) {
      ranking.forEach((item, rank) => {
        if (!scoreMap[item.id]) scoreMap[item.id] = 0;
        scoreMap[item.id] += 1 / (k + rank + 1);
      });
    }
    return Object.entries(scoreMap)
      .map(([id, score]) => ({ id, score }))
      .sort((a, b) => b.score - a.score);
  }

  // ── Load Index ───────────────────────────────────────────────────
  async function load() {
    if (ready) return;
    try {
      const resp = await fetch("data/search_index.json");
      if (!resp.ok) {
        console.warn(
          "Search index not found — run scripts/build_index.py first",
        );
        ready = true;
        return;
      }
      index = await resp.json();
      index.bm25 = new BM25(index.chunks);
      ready = true;
      console.log(
        `Search index loaded: ${index.chunks.length} chunks from ${index.documents.length} documents`,
      );
    } catch (e) {
      console.warn("Failed to load search index:", e);
      ready = true;
    }
  }

  function isReady() {
    return ready && index !== null;
  }

  // ── Search ───────────────────────────────────────────────────────
  async function search(query, topK = 15) {
    if (!isReady()) return [];

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    // 1. BM25 keyword ranking
    const bm25Results = index.bm25.score(queryTokens);

    // 2. Semantic ranking (only if embeddings available)
    let embeddingResults = [];
    if (index.query_embedding_fn) {
      try {
        const queryEmb = await embedQuery(query);
        if (queryEmb) {
          embeddingResults = embeddingSearch(queryEmb, index.chunks);
        }
      } catch (e) {
        console.warn("Embedding search failed, falling back to BM25 only:", e);
      }
    } else {
      // No embedding model — just use BM25 with decay
      const chunkMap = new Map(index.chunks.map((c) => [c.id, c]));
      const docMap = new Map((index.documents || []).map((d) => [d.id, d]));
      return bm25Results
        .slice(0, topK)
        .map((r) => {
          const chunk = chunkMap.get(r.id);
          const doc = docMap.get(chunk?.doc_id);
          const decay = computeDecay(doc?.date);
          const finalScore = r.score * decay;
          return formatResult(r.id, finalScore, chunk, queryTokens, decay);
        })
        .sort((a, b) => b.score - a.score);
    }

    // 3. Ensemble with RRF
    const fused = rrf([bm25Results, embeddingResults]);

    // Build results with decay
    const chunkMap = new Map(index.chunks.map((c) => [c.id, c]));
    const docMap = new Map((index.documents || []).map((d) => [d.id, d]));
    return fused
      .slice(0, topK)
      .map((r) => {
        const chunk = chunkMap.get(r.id);
        const doc = docMap.get(chunk?.doc_id);
        const decay = computeDecay(doc?.date);
        const finalScore = r.score * decay;
        return formatResult(r.id, finalScore, chunk, queryTokens, decay);
      })
      .sort((a, b) => b.score - a.score);
  }

  // ── Client-side query embedding (using Transformers.js if available) ──
  async function embedQuery(query) {
    if (!index || !index.embeddings_model) return null;

    // Use the pre-computed average embedding as a rough fallback
    // In a full implementation, we'd use Transformers.js or an API
    // For static sites without a backend, we use a smart keyword-to-embedding mapping

    // Simple approach: average the embeddings of matching keywords
    const tokens = tokenize(query);
    const tokenEmbMap = index.token_embeddings || {};

    if (Object.keys(tokenEmbMap).length === 0) return null;

    const dim =
      index.embedding_dim || Object.values(tokenEmbMap)[0]?.length || 384;
    const avg = new Array(dim).fill(0);
    let count = 0;

    for (const token of tokens) {
      if (tokenEmbMap[token]) {
        const emb = tokenEmbMap[token];
        for (let i = 0; i < dim; i++) avg[i] += emb[i];
        count++;
      }
    }

    if (count === 0) return null;

    for (let i = 0; i < dim; i++) avg[i] /= count;
    return avg;
  }

  function formatResult(id, score, chunk, queryTokens, decay = 1.0) {
    // Highlight query terms in snippet
    let snippet = chunk.content.substring(0, 300);
    for (const term of queryTokens) {
      const re = new RegExp(`(${escapeRegex(term)})`, "gi");
      snippet = snippet.replace(re, "<mark>$1</mark>");
    }

    // Find source document
    const doc = index
      ? index.documents.find((d) => d.id === chunk.doc_id)
      : null;

    return {
      id,
      chunkId: chunk.id,
      docId: chunk.doc_id,
      title: chunk.title || (doc ? doc.title : "Untitled"),
      snippet,
      score: score.toFixed(4),
      source: doc ? doc.path : "",
      section: chunk.section || "",
      sectionSlug: chunk.section ? slugify(chunk.section) : "",
      date: doc ? doc.date : null,
      decay: decay.toFixed(3),
    };
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // ── Get documents list ───────────────────────────────────────────
  function getDocuments() {
    if (!index) return [];
    return index.documents || [];
  }

  // ── Get chunk by id ──────────────────────────────────────────────
  function getChunk(id) {
    if (!index) return null;
    return index.chunks.find((c) => c.id === id) || null;
  }

  function getDocument(id) {
    if (!index) return null;
    return index.documents.find((d) => d.id === id) || null;
  }

  return { load, isReady, search, getDocuments, getChunk, getDocument };
})();
