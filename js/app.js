/**
 * CEI Resources — Main Application
 * Tab navigation, document browser, search UI
 */

document.addEventListener("DOMContentLoaded", async () => {
  // ── Tab Navigation ───────────────────────────────────────────────
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".tab-content");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((t) => t.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(`tab-${target}`).classList.add("active");
    });
  });

  // ── Init Timetable Module ────────────────────────────────────────
  Timetable.init();

  // ── Document List & Modal ────────────────────────────────────────
  function buildDocList() {
    const docs = SearchEngine.getDocuments();
    const container = document.getElementById("doc-list");

    if (docs.length === 0) {
      container.innerHTML = `
        <div class="search-empty">
          <p>No documents indexed yet.</p>
          <p style="margin-top:.5rem;font-size:.8rem">Run <code>python scripts/build_index.py</code> to generate the search index,<br>
          or <code>python scripts/pdf_to_md.py documents/yourfile.pdf</code> to convert a PDF.</p>
        </div>`;
      return;
    }

    container.innerHTML = docs
      .map(
        (doc) => `
      <div class="doc-card" data-doc-id="${doc.id}">
        <span class="doc-icon">📄</span>
        <div class="doc-info">
          <div class="doc-name">${escapeHtml(doc.title)}</div>
          <div class="doc-meta">${doc.chunks || 0} sections · ${doc.path || ""}</div>
        </div>
        <span class="doc-arrow">→</span>
      </div>
    `,
      )
      .join("");

    container.querySelectorAll(".doc-card").forEach((card) => {
      card.addEventListener("click", () => openDocument(card.dataset.docId));
    });
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function openDocument(docId, sectionSlug) {
    const doc = SearchEngine.getDocument(docId);
    if (!doc) return;

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay visible";
    overlay.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2>${escapeHtml(doc.title)}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body" id="modal-body">
          <p style="color:var(--text-muted)">Loading...</p>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    fetch(doc.path)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.text();
      })
      .then((md) => {
        document.getElementById("modal-body").innerHTML = renderMarkdown(md);
        if (sectionSlug) {
          requestAnimationFrame(() => {
            const el = document.getElementById(sectionSlug);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          });
        }
      })
      .catch(() => {
        document.getElementById("modal-body").innerHTML =
          '<p style="color:var(--text-muted)">Failed to load document. The file may not exist yet.</p>';
      });

    const close = () => overlay.remove();
    overlay.querySelector(".modal-close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.addEventListener("keydown", function esc(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", esc);
      }
    });
  }

  // ── Simple Markdown Renderer ─────────────────────────────────────
  function renderMarkdown(md) {
    let html = md;

    // Code blocks (fenced)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Headers (with id for anchor linking)
    html = html.replace(
      /^###### (.+)$/gm,
      (_, text) => `<h6 id="${slugify(text)}">${text}</h6>`,
    );
    html = html.replace(
      /^##### (.+)$/gm,
      (_, text) => `<h5 id="${slugify(text)}">${text}</h5>`,
    );
    html = html.replace(
      /^#### (.+)$/gm,
      (_, text) => `<h4 id="${slugify(text)}">${text}</h4>`,
    );
    html = html.replace(
      /^### (.+)$/gm,
      (_, text) => `<h3 id="${slugify(text)}">${text}</h3>`,
    );
    html = html.replace(
      /^## (.+)$/gm,
      (_, text) => `<h2 id="${slugify(text)}">${text}</h2>`,
    );
    html = html.replace(
      /^# (.+)$/gm,
      (_, text) => `<h1 id="${slugify(text)}">${text}</h1>`,
    );

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Blockquotes
    html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
    html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

    // Horizontal rules
    html = html.replace(/^---$/gm, "<hr>");

    // Tables (multi-pass: collect rows, flush)
    const lines = html.split("\n");
    const result = [];
    let inTable = false;
    let tableRows = [];
    let headerRow = null;
    let maxCols = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\|.+\|$/.test(line.trim())) {
        // Split but keep empty cells (don't filter them out)
        const raw = line.trim().split("|");
        // Remove first and last empty elements from split (leading/trailing |)
        const cells = raw.slice(1, -1).map((c) => c.trim());
        if (!inTable) {
          inTable = true;
          headerRow = cells;
          maxCols = cells.length;
          continue;
        }
        if (cells.every((c) => /^[\s:-]+$/.test(c))) continue;
        if (cells.length > maxCols) maxCols = cells.length;
        tableRows.push(cells);
      } else {
        if (inTable) {
          let tbl = "<table>";
          if (headerRow) {
            // Pad header to maxCols
            while (headerRow.length < maxCols) headerRow.push("");
            tbl +=
              "<thead><tr>" +
              headerRow.map((c) => `<th>${c}</th>`).join("") +
              "</tr></thead>";
          }
          tbl +=
            "<tbody>" +
            tableRows
              .map((r) => {
                // Pad row to maxCols
                while (r.length < maxCols) r.push("");
                return (
                  "<tr>" + r.map((c) => `<td>${c}</td>`).join("") + "</tr>"
                );
              })
              .join("") +
            "</tbody>";
          tbl += "</table>";
          result.push(tbl);
          inTable = false;
          tableRows = [];
          headerRow = null;
        }
        result.push(line);
      }
    }
    if (inTable) {
      let tbl = "<table>";
      if (headerRow) {
        tbl +=
          "<thead><tr>" +
          headerRow.map((c) => `<th>${c}</th>`).join("") +
          "</tr></thead>";
      }
      if (tableRows.length > 0) {
        tbl +=
          "<tbody>" +
          tableRows
            .map(
              (r) => "<tr>" + r.map((c) => `<td>${c}</td>`).join("") + "</tr>",
            )
            .join("") +
          "</tbody>";
      }
      tbl += "</table>";
      result.push(tbl);
    }
    html = result.join("\n");

    // Unordered lists
    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, (match) => {
      if (match.includes("<ul>")) return match;
      return `<ul>${match}</ul>`;
    });

    // Links
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );

    // Paragraphs
    html = html.replace(/^(?!<[a-z]|<\/|$)(.+)$/gm, "<p>$1</p>");
    html = html.replace(/<p>\s*<\/p>/g, "");

    return html;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Search UI ────────────────────────────────────────────────────
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  let debounceTimer;
  let selectedIndex = -1;

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();

    if (query.length < 2) {
      searchResults.classList.remove("visible");
      searchResults.innerHTML = "";
      selectedIndex = -1;
      return;
    }

    debounceTimer = setTimeout(async () => {
      const results = await SearchEngine.search(query);
      selectedIndex = -1;
      renderSearchResults(results, query);
    }, 200);
  });

  searchInput.addEventListener("keydown", (e) => {
    const items = searchResults.querySelectorAll(".search-result-item");
    if (items.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      updateActiveResult(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateActiveResult(items);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) items[selectedIndex].click();
    } else if (e.key === "Escape") {
      searchResults.classList.remove("visible");
      searchInput.blur();
    }
  });

  function updateActiveResult(items) {
    items.forEach((item, i) =>
      item.classList.toggle("active", i === selectedIndex),
    );
    if (selectedIndex >= 0)
      items[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }

  function renderSearchResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `<div class="search-empty">No results found for "<strong>${escapeHtml(query)}</strong>"</div>`;
      searchResults.classList.add("visible");
      return;
    }

    searchResults.innerHTML = results
      .map(
        (r) => `
      <div class="search-result-item" data-doc-id="${r.docId}" data-section-slug="${r.sectionSlug || ""}">
        <div class="result-title">${r.title} ${r.section ? "\u2014 " + r.section : ""}${r.decay < 0.99 ? ` <span class="decay-badge" title="Relevance decayed due to age">\u{1F4C5} ${r.date || "older"}</span>` : ""}</div>
        <div class="result-snippet">${r.snippet}</div>
        <div class="result-source">\u{1F4C4} ${r.source} \u00b7 Score: ${r.score}</div>
      </div>
    `,
      )
      .join("");

    searchResults.classList.add("visible");

    searchResults.querySelectorAll(".search-result-item").forEach((item) => {
      item.addEventListener("click", () => {
        searchResults.classList.remove("visible");
        searchInput.value = "";
        if (item.dataset.docId)
          openDocument(
            item.dataset.docId,
            item.dataset.sectionSlug || undefined,
          );
      });
    });
  }

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-bar")) {
      searchResults.classList.remove("visible");
    }
  });

  // ── Init ─────────────────────────────────────────────────────────
  await SearchEngine.load();
  buildDocList();
});
