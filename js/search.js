/**
 * CEI Search Engine
 * BM25 (keyword) + title matching + tag matching + RRF fusion
 * Compact index, no embeddings — loads ~300 KB near-instantly.
 */

const SearchEngine = (() => {
  let index = null;
  let ready = false;

  // ── BM25 Parameters ───────────────────────────────────────────────
  const BM25_K1 = 1.5;
  const BM25_B = 0.75;

  function tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 1);
  }

  // ── Alias Expansion ───────────────────────────────────────────────
  function expandQuery(query) {
    const aliases = index?.aliases || {};
    const normalized = query.toLowerCase().replace(/\//g, " ");
    let expanded = query;
    for (const [alias, expansion] of Object.entries(aliases)) {
      const re = new RegExp(`\\b${escapeRegex(alias)}\\b`, "gi");
      if (re.test(normalized)) {
        expanded += " " + expansion;
      }
    }
    return expanded;
  }

  // ── Typo Correction ───────────────────────────────────────────────
  function levenshtein(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const prev = Array(b.length + 1).fill(0);
    const curr = Array(b.length + 1).fill(0);
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      curr[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
        // Transposed characters: "preceptron" → "perceptron"
        if (
          i > 1 &&
          j > 1 &&
          a[i - 1] === b[j - 2] &&
          a[i - 2] === b[j - 1]
        ) {
          curr[j] = Math.min(curr[j], prev[j - 2] + cost);
        }
      }
      const tmp = prev;
      prev.length = 0;
      for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
      curr.length = 0;
    }
    return prev[b.length];
  }

  function correctToken(token, vocab) {
    if (token.length < 3) return null;
    const maxDist = token.length <= 4 ? 1 : 2;
    let best = null;
    let bestDist = maxDist + 1;
    const first = token[0];

    for (const word of vocab) {
      if (word[0] !== first) continue;
      if (Math.abs(word.length - token.length) > 2) continue;
      const dist = levenshtein(token, word);
      if (
        dist < bestDist ||
        (dist === bestDist && best && word.length < best.length)
      ) {
        bestDist = dist;
        best = word;
      }
      if (bestDist === 0) break;
    }
    return bestDist <= maxDist ? best : null;
  }

  function correctQueryTokens(tokens) {
    if (!index || !index.bm25) return tokens;
    const vocab = Object.keys(index.bm25.df);
    const aliases = index.aliases || {};
    for (const v of Object.values(aliases)) {
      for (const w of v.split(/\s+/)) {
        if (w.length > 2 && !vocab.includes(w)) vocab.push(w);
      }
    }
    return tokens.map((t) => {
      if (index.bm25.df[t]) return t;
      if (aliases[t.toLowerCase()]) return t;
      const corrected = correctToken(t, vocab);
      if (corrected && corrected !== t) {
        console.log(`Typo: "${t}" → "${corrected}"`);
        return corrected;
      }
      return t;
    });
  }

  // ── BM25 with heading boost ──────────────────────────────────────
  class BM25 {
    constructor(chunks) {
      this.N = chunks.length;
      this.avgdl =
        chunks.reduce((s, c) => s + c.tokens.length, 0) / Math.max(1, this.N);
      this.docs = chunks.map((c) => ({
        id: c.id,
        tokens: c.tokens,
        tf: buildTF(c.tokens),
        section: c.section,
        title: c.title,
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
        // Boost: matches in section heading (×1.5) or document title (×2.0)
        if (s > 0) {
          const haystack =
            (doc.section || "") + " " + (doc.title || "");
          const haystackLower = haystack.toLowerCase();
          for (const term of queryTokens) {
            if (haystackLower.includes(term)) {
              s *= doc.section && doc.section.toLowerCase().includes(term)
                ? 1.5
                : 2.0;
              break; // apply once per doc
            }
          }
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

  // ── Title Ranking ─────────────────────────────────────────────────
  function titleRanking(queryTokens) {
    if (!index || !index.chunks) return [];
    const chunkMap = new Map(index.chunks.map((c) => [c.id, c]));
    const scored = [];
    for (const [id, chunk] of chunkMap) {
      const haystack =
        (chunk.section + " " + chunk.title).toLowerCase();
      let hits = 0;
      for (const term of queryTokens) {
        if (haystack.includes(term)) hits++;
      }
      if (hits > 0) {
        scored.push({ id, score: hits / queryTokens.length });
      }
    }
    return scored.sort((a, b) => b.score - a.score);
  }

  // ── Tag Ranking ───────────────────────────────────────────────────
  function tagRanking(queryTokens) {
    if (!index || !index.chunks) return [];
    const scored = [];
    for (const chunk of index.chunks) {
      const tags = chunk.tags || [];
      let hits = 0;
      for (const term of queryTokens) {
        for (const tag of tags) {
          if (tag.includes(term) || term.includes(tag)) hits++;
        }
      }
      if (hits > 0) {
        scored.push({ id: chunk.id, score: hits });
      }
    }
    return scored.sort((a, b) => b.score - a.score);
  }

  // ── RRF Fusion ────────────────────────────────────────────────────
  function rrf(rankings, k = 60) {
    const scoreMap = {};
    for (const ranking of rankings) {
      ranking.forEach(({ id, score }, rank) => {
        if (score <= 0) return;
        scoreMap[id] = (scoreMap[id] || 0) + 1 / (k + rank + 1);
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
      const resp = await fetch("data/search_index.json?v=2");
      if (!resp.ok) {
        console.warn(
          "Search index not found — run python scripts/build_index.py",
        );
        ready = true;
        return;
      }
      index = await resp.json();
      index.bm25 = new BM25(index.chunks);
      ready = true;
      console.log(
        `Search index loaded: ${index.chunks.length} chunks from ${index.documents.length} documents (${index.aliases ? Object.keys(index.aliases).length : 0} aliases)`,
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

    query = expandQuery(query);

    // Multi-query: split by comma, fuse with RMS
    const subQueries = query
      .split(",")
      .map((q) => q.trim())
      .filter((q) => q.length > 0);
    if (subQueries.length > 1) {
      return searchMulti(subQueries, topK);
    }

    return searchSingle(query, topK);
  }

  async function searchSingle(query, topK = 15) {
    let queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    queryTokens = correctQueryTokens(queryTokens);

    const bm25Results = index.bm25.score(queryTokens);

    // Fuse BM25 + title ranking + tag ranking
    const fused = rrf([
      bm25Results,
      titleRanking(queryTokens),
      tagRanking(queryTokens),
    ]);

    const chunkMap = new Map(index.chunks.map((c) => [c.id, c]));
    const docMap = new Map((index.documents || []).map((d) => [d.id, d]));
    return fused
      .slice(0, topK)
      .map((r) => {
        const chunk = chunkMap.get(r.id);
        return formatResult(r.id, r.score, chunk, queryTokens, docMap);
      })
      .sort(sortByScoreThenDate);
  }

  async function searchMulti(subQueries, topK = 15) {
    const allScores = await Promise.all(subQueries.map((q) => getRRFScores(q)));
    const combined = {};
    const allChunkIds = new Set();
    for (const scores of allScores) {
      for (const id of Object.keys(scores)) allChunkIds.add(id);
    }
    for (const id of allChunkIds) {
      const values = allScores.map((s) => s[id] || 0);
      combined[id] = Math.sqrt(
        values.reduce((sum, v) => sum + v * v, 0) / values.length,
      );
    }
    const ranked = Object.entries(combined)
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK);

    const firstQueryTokens = tokenize(subQueries[0]);
    const chunkMap = new Map(index.chunks.map((c) => [c.id, c]));
    const docMap = new Map((index.documents || []).map((d) => [d.id, d]));
    return ranked.map(([id, score]) => {
      const chunk = chunkMap.get(id);
      return formatResult(id, score, chunk, firstQueryTokens, docMap);
    });
  }

  async function getRRFScores(query) {
    let queryTokens = tokenize(query);
    if (queryTokens.length === 0) return {};
    queryTokens = correctQueryTokens(queryTokens);
    const bm25Results = index.bm25.score(queryTokens);
    return rrfToMap(
      rrf([bm25Results, titleRanking(queryTokens), tagRanking(queryTokens)]),
    );
  }

  function rrfToMap(fused) {
    const map = {};
    for (const { id, score } of fused) map[id] = score;
    return map;
  }

  function sortByScoreThenDate(a, b) {
    const scoreDiff = parseFloat(b.score) - parseFloat(a.score);
    if (Math.abs(scoreDiff) > 0.0001) return scoreDiff;
    const da = a.date ? new Date(a.date) : new Date(0);
    const db = b.date ? new Date(b.date) : new Date(0);
    return db - da;
  }

  function formatResult(id, score, chunk, queryTokens, docMap) {
    let snippet = chunk.content.substring(0, 300);
    for (const term of queryTokens) {
      const re = new RegExp(`(${escapeRegex(term)})`, "gi");
      snippet = snippet.replace(re, "<mark>$1</mark>");
    }
    const doc = docMap.get(chunk.doc_id);
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

  function getDocuments() {
    if (!index) return [];
    return index.documents || [];
  }

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
