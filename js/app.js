/**
 * CEI3 Resources — Main Application
 * Burger menu, view switching, search integration
 */

document.addEventListener("DOMContentLoaded", async () => {
  // ── Burger Menu ──────────────────────────────────────────────────
  const burgerBtn = document.getElementById("burger-btn");
  const burgerDrawer = document.getElementById("burger-drawer");
  const burgerOverlay = document.getElementById("burger-overlay");

  function openBurger() {
    burgerDrawer.classList.add("open");
    burgerOverlay.classList.add("visible");
  }
  function closeBurger() {
    burgerDrawer.classList.remove("open");
    burgerOverlay.classList.remove("visible");
  }

  burgerBtn.addEventListener("click", openBurger);
  burgerOverlay.addEventListener("click", closeBurger);
  document
    .getElementById("burger-close")
    ?.addEventListener("click", closeBurger);

  // ── View Switching ────────────────────────────────────────────────
  const views = {
    home: document.getElementById("view-home"),
    documents: document.getElementById("view-documents"),
  };
  const navLinks = document.querySelectorAll("[data-nav]");

  function switchView(name) {
    Object.entries(views).forEach(([k, v]) => {
      v.classList.toggle("hidden", k !== name);
    });
    navLinks.forEach((l) =>
      l.classList.toggle("active", l.dataset.nav === name),
    );
    closeBurger();
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      switchView(link.dataset.nav);
    });
  });

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
      searchResults.innerHTML = `<div class="search-empty">No results for "<strong>${escapeHtml(query)}</strong>"</div>`;
      searchResults.classList.add("visible");
      return;
    }

    searchResults.innerHTML = results
      .map(
        (r) => `
      <div class="search-result-item" data-doc-id="${r.docId}" data-section-slug="${r.sectionSlug || ""}">
        <div class="result-title">${r.title} ${r.section ? "\u2014 " + r.section : ""}${r.date ? ` <span class="result-date">\u{1F4C5} ${r.date}</span>` : ""}</div>
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

  // ── Document Browser ─────────────────────────────────────────────
  function buildDocList() {
    const docs = SearchEngine.getDocuments();
    const container = document.getElementById("doc-list");

    if (docs.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No documents indexed yet.</p>
          <p class="hint">Run <code>python scripts/build_index.py</code> to generate the search index.</p>
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
          <div class="doc-meta">${doc.date || ""} · ${doc.path || ""}</div>
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
          '<p style="color:var(--text-muted)">Failed to load document.</p>';
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
    html = html.replace(
      /```(\w*)\n([\s\S]*?)```/g,
      (_, lang, code) =>
        `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`,
    );
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    for (let level = 6; level >= 1; level--) {
      const hashes = "#".repeat(level);
      const tag = `h${level}`;
      html = html.replace(
        new RegExp(`^${hashes} (.+)$`, "gm"),
        (_, text) => `<${tag} id="${slugify(text)}">${text}</${tag}>`,
      );
    }
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
    html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");
    html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");
    html = html.replace(/^---$/gm, "<hr>");

    // Tables
    const lines = html.split("\n");
    const result = [];
    let inTable = false;
    let tableRows = [];
    let headerRow = null;
    let maxCols = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^\|.+\|$/.test(line.trim())) {
        const raw = line.trim().split("|");
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
          result.push(buildTable(headerRow, tableRows, maxCols));
          inTable = false;
          tableRows = [];
          headerRow = null;
        }
        result.push(line);
      }
    }
    if (inTable) result.push(buildTable(headerRow, tableRows, maxCols));
    html = result.join("\n");

    html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, (match) => {
      if (match.includes("<ul>")) return match;
      return `<ul>${match}</ul>`;
    });
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener">$1</a>',
    );
    html = html.replace(/^(?!<[a-z]|<\/|$)(.+)$/gm, "<p>$1</p>");
    html = html.replace(/<p>\s*<\/p>/g, "");
    return html;
  }

  function buildTable(headerRow, tableRows, maxCols) {
    if (!headerRow && !tableRows.length) return "";
    let tbl = "<table>";
    if (headerRow) {
      while (headerRow.length < maxCols) headerRow.push("");
      tbl +=
        "<thead><tr>" +
        headerRow.map((c) => `<th>${c}</th>`).join("") +
        "</tr></thead>";
    }
    if (tableRows.length) {
      tbl +=
        "<tbody>" +
        tableRows
          .map((r) => {
            while (r.length < maxCols) r.push("");
            return "<tr>" + r.map((c) => `<td>${c}</td>`).join("") + "</tr>";
          })
          .join("") +
        "</tbody>";
    }
    tbl += "</table>";
    return tbl;
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Init ─────────────────────────────────────────────────────────
  // Search index is 28MB — load in background, don't block the page
  const searchReady = SearchEngine.load();

  // Render essentials immediately (reminders + timetable)
  await Promise.all([RemindersModule.load(), Timetable.init()]);
  RemindersModule.render();

  // Background: courses then documents (populate as data arrives)
  CoursesModule.load().then(() => CoursesModule.render());
  searchReady.then(() => {
    if (SearchEngine.isReady()) buildDocList();
  });
});
