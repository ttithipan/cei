/**
 * CEI Timetable — Weekly grid
 * Days=columns, Time=rows, 08:00–20:00, popup editor
 */

const Timetable = (() => {
  const STORAGE_KEY = "cei_grid_v3";
  const DAYS = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Time slots 08:00–20:00 in 30-min steps
  const TIME_SLOTS = [];
  for (let h = 8; h < 20; h++) {
    for (let m = 0; m < 60; m += 30) {
      const s = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const eh = m === 30 ? h + 1 : h;
      const em = m === 30 ? 0 : 30;
      const e = `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
      TIME_SLOTS.push({ label: s, start: s, end: e });
    }
  }

  // ── State ───────────────────────────────────────────────────────
  let courseData = null;
  let activeYear = "1";
  let grid = []; // grid[timeIdx][dayIdx] = {code,name,room,start,end,source} | null
  let popupTarget = null; // {ti, di}

  // ── Load courses.json ───────────────────────────────────────────
  async function loadCourseData() {
    try {
      const resp = await fetch("data/courses.json");
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      courseData = await resp.json();
      const src = document.getElementById("data-source");
      if (src && courseData.generated) {
        src.textContent = `Data: ${new Date(courseData.generated).toLocaleDateString("th-TH")}`;
      }
    } catch (e) {
      console.warn("courses.json:", e);
      courseData = null;
    }
  }

  // ── Grid persistence ────────────────────────────────────────────
  function loadGrid() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        grid = Array.from({ length: TIME_SLOTS.length }, (_, ti) =>
          Array.from(
            { length: DAYS.length },
            (_, di) => saved[ti]?.[di] || null,
          ),
        );
        return;
      }
    } catch (e) {}
    initEmptyGrid();
  }

  function initEmptyGrid() {
    grid = Array.from({ length: TIME_SLOTS.length }, () =>
      Array(DAYS.length).fill(null),
    );
  }

  function saveGrid() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
  }

  // ── Populate from JSON (day index = 1-based in data, we use 0-based) ──
  function populateFromJSON() {
    if (!courseData?.years?.[activeYear]?.courses) return;
    initEmptyGrid();
    for (const c of courseData.years[activeYear].courses) {
      const di = c.day; // 0=Sun,1=Mon,...,6=Sat (standard JS getDay convention)
      if (di < 0 || di >= DAYS.length) continue;
      if (!c.start || !c.end) continue;

      const [sh, sm] = c.start.split(":").map(Number);
      const [eh, em] = c.end.split(":").map(Number);
      const startMin = sh * 60 + sm;
      const endMin = eh * 60 + em;

      for (let ti = 0; ti < TIME_SLOTS.length; ti++) {
        const [ssh, ssm] = TIME_SLOTS[ti].start.split(":").map(Number);
        const slotMin = ssh * 60 + ssm;
        if (slotMin >= startMin && slotMin < endMin) {
          grid[ti][di] = {
            code: c.code || "",
            name: c.name || "",
            room: c.room || "",
            start: c.start,
            end: c.end,
            source: "regis",
          };
        }
      }
    }
    saveGrid();
  }

  // ── Cell ops ────────────────────────────────────────────────────
  function setCell(ti, di, data) {
    grid[ti][di] = data;
    saveGrid();
    renderGrid();
  }

  function clearCell(ti, di) {
    grid[ti][di] = null;
    saveGrid();
    renderGrid();
  }

  function fillSlots(ti, di, start, end, data) {
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const smin = sh * 60 + sm;
    const emin = eh * 60 + em;
    for (let i = ti; i < TIME_SLOTS.length; i++) {
      const [ssh, ssm] = TIME_SLOTS[i].start.split(":").map(Number);
      const slotMin = ssh * 60 + ssm;
      if (slotMin >= smin && slotMin < emin) {
        grid[i][di] = { ...data, start, end };
      } else if (slotMin >= emin) break;
    }
    saveGrid();
  }

  function getSpan(ti, di) {
    const cell = grid[ti][di];
    if (!cell) return { rowSpan: 1, isFirst: true };
    if (
      ti > 0 &&
      grid[ti - 1][di] &&
      grid[ti - 1][di].code === cell.code &&
      grid[ti - 1][di].start === cell.start
    ) {
      return { rowSpan: 0, isFirst: false };
    }
    let s = 1;
    for (let i = ti + 1; i < TIME_SLOTS.length; i++) {
      const n = grid[i][di];
      if (n && n.code === cell.code && n.start === cell.start) s++;
      else break;
    }
    return { rowSpan: s, isFirst: true };
  }

  // ── Available courses ───────────────────────────────────────────
  function getAvailableCourses() {
    if (!courseData?.years?.[activeYear]?.courses) return [];
    return courseData.years[activeYear].courses.filter((c) => c.name && c.code);
  }

  function getGenEdCourses() {
    // Collect all GenEd courses across all years (deduplicated by code)
    const seen = new Set();
    const gened = [];
    if (!courseData?.years) return gened;
    for (const y of Object.values(courseData.years)) {
      for (const c of y.courses || []) {
        if (c.tag === "GenEd" && c.code && !seen.has(c.code)) {
          seen.add(c.code);
          gened.push(c);
        }
      }
    }
    return gened;
  }

  // ── Render: Year Tabs ───────────────────────────────────────────
  function renderYearTabs() {
    const c = document.getElementById("year-tabs");
    if (!c || !courseData?.years) return;
    const years = Object.keys(courseData.years).sort();
    c.innerHTML = years
      .map(
        (y) =>
          `<button class="year-tab${y === activeYear ? " active" : ""}" data-year="${y}">${courseData.years[y].label || "Year " + y}</button>`,
      )
      .join("");
    c.querySelectorAll(".year-tab").forEach((b) =>
      b.addEventListener("click", () => {
        activeYear = b.dataset.year;
        popupTarget = null;
        populateFromJSON();
        renderYearTabs();
        renderGrid();
        renderExamSchedule();
        updateRegisLink();
      }),
    );
  }

  // ── Render: Weekly Grid ─────────────────────────────────────────
  function renderGrid() {
    const container = document.getElementById("weekly-timetable");
    if (!container) return;

    let h =
      '<div class="grid-scroll"><table class="grid-table"><thead><tr><th class="time-th"></th>';
    for (const d of DAYS) h += `<th>${d}</th>`;
    h += "</tr></thead><tbody>";

    for (let ti = 0; ti < TIME_SLOTS.length; ti++) {
      const slot = TIME_SLOTS[ti];
      const showTime = slot.label.endsWith(":00");
      h += "<tr>";
      h += `<td class="time-th">${showTime ? slot.label : ""}</td>`;
      for (let di = 0; di < DAYS.length; di++) {
        const cell = grid[ti][di];
        const span = cell ? getSpan(ti, di) : { rowSpan: 1, isFirst: true };
        if (span.rowSpan === 0) continue;
        h += `<td class="grid-cell${cell ? " filled" : ""}" rowspan="${span.rowSpan}" data-ti="${ti}" data-di="${di}">`;
        if (cell) {
          h += `<div class="cell-content">
            <div class="cell-code">${esc(cell.code)}</div>
            <div class="cell-name">${esc(cell.name)}</div>
            ${cell.room ? `<div class="cell-room">${esc(cell.room)}</div>` : ""}
            ${cell.source === "manual" ? '<span class="cell-badge">✏️</span>' : ""}
            <button class="cell-pen" data-ti="${ti}" data-di="${di}" title="Edit">✏️</button>
          </div>`;
        } else {
          h += `<div class="cell-empty" data-ti="${ti}" data-di="${di}">
            <span class="cell-plus">+</span>
          </div>`;
        }
        h += "</td>";
      }
      h += "</tr>";
    }
    h += "</tbody></table></div>";
    container.innerHTML = h;
    attachGridEvents();
  }

  function attachGridEvents() {
    const ct = document.getElementById("weekly-timetable");
    if (!ct) return;

    // Pen click → open popup
    ct.querySelectorAll(".cell-pen").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openPopup(parseInt(btn.dataset.ti), parseInt(btn.dataset.di));
      });
    });

    // Empty cell click → open popup
    ct.querySelectorAll(".cell-empty").forEach((div) => {
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        openPopup(parseInt(div.dataset.ti), parseInt(div.dataset.di));
      });
      // Long press on mobile
      let timer;
      div.addEventListener(
        "touchstart",
        (e) => {
          timer = setTimeout(() => {
            e.preventDefault();
            openPopup(parseInt(div.dataset.ti), parseInt(div.dataset.di));
          }, 500);
        },
        { passive: false },
      );
      div.addEventListener("touchend", () => clearTimeout(timer));
      div.addEventListener("touchmove", () => clearTimeout(timer));
    });

    // Filled cell click → open popup (for mobile ease)
    ct.querySelectorAll(".cell-content").forEach((div) => {
      div.addEventListener("click", (e) => {
        if (e.target.closest(".cell-pen")) return; // pen handles itself
        const td = div.closest(".grid-cell");
        openPopup(parseInt(td.dataset.ti), parseInt(td.dataset.di));
      });
      // Long press
      let timer;
      div.addEventListener(
        "touchstart",
        (e) => {
          timer = setTimeout(() => {
            e.preventDefault();
            const td = div.closest(".grid-cell");
            openPopup(parseInt(td.dataset.ti), parseInt(td.dataset.di));
          }, 500);
        },
        { passive: false },
      );
      div.addEventListener("touchend", () => clearTimeout(timer));
      div.addEventListener("touchmove", () => clearTimeout(timer));
    });
  }

  // ── Popup Editor ────────────────────────────────────────────────
  function openPopup(ti, di) {
    popupTarget = { ti, di };
    const cell = grid[ti][di];
    const courses = getAvailableCourses();
    const genedCourses = getGenEdCourses();
    const slot = TIME_SLOTS[ti];

    let html = `<div class="popup-overlay visible" id="cell-popup-overlay">
      <div class="popup-card">
        <div class="popup-header">
          <span>${DAYS[di]} ${slot.label}</span>
          <button class="popup-close">&times;</button>
        </div>
        <div class="popup-body">
          <input type="text" class="popup-search" id="popup-search" placeholder="🔍 Search courses..." autocomplete="off">
          <div class="popup-list" id="popup-list">`;

    // Show matching courses
    const renderList = (filter = "") => {
      const list = document.getElementById("popup-list");
      if (!list) return;
      const q = filter.toLowerCase();

      const majorCourses = courses.filter((c) => c.tag !== "GenEd");
      const gened = genedCourses.filter(
        (c) =>
          !q ||
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q),
      );
      const majorFiltered = majorCourses.filter(
        (c) =>
          !q ||
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q),
      );

      let html = "";
      if (majorFiltered.length > 0) {
        html += '<div class="popup-section-title">📚 Major</div>';
        html += majorFiltered
          .map(
            (c) => `
          <div class="popup-item" data-code="${esc(c.code)}">
            <span class="popup-item-code">${esc(c.code)}</span>
            <span class="popup-item-name">${esc(c.name)}</span>
            <span class="popup-item-meta">${esc(c.room || "")} ${c.start || ""}–${c.end || ""}</span>
          </div>
        `,
          )
          .join("");
      }
      if (gened.length > 0) {
        html += '<div class="popup-section-title">🎓 GenEd</div>';
        html += gened
          .map(
            (c) => `
          <div class="popup-item gened-item" data-code="${esc(c.code)}">
            <span class="popup-item-code">${esc(c.code)}</span>
            <span class="popup-item-name">${esc(c.name)}</span>
            <span class="popup-item-meta">${esc(c.room || "")} ${c.start || ""}–${c.end || ""}</span>
          </div>
        `,
          )
          .join("");
      }
      if (!html) {
        html = '<div class="popup-empty">No matches — use custom below</div>';
      }
      list.innerHTML = html;
      // Click to select
      list.querySelectorAll(".popup-item").forEach((item) => {
        item.addEventListener("click", () => {
          const code = item.dataset.code;
          const course = [...courses, ...genedCourses].find(
            (c) => c.code === code,
          );
          if (course) {
            fillSlots(
              ti,
              di,
              course.start || slot.start,
              course.end ||
                TIME_SLOTS[Math.min(ti + 3, TIME_SLOTS.length - 1)].end,
              {
                code: course.code,
                name: course.name,
                room: course.room || "",
                start: course.start || slot.start,
                end:
                  course.end ||
                  TIME_SLOTS[Math.min(ti + 3, TIME_SLOTS.length - 1)].end,
                source: "regis",
              },
            );
            closePopup();
            renderGrid();
          }
        });
      });
    };

    // Custom entry fields
    html += `</div>
          <div class="popup-custom">
            <div class="popup-custom-title">— or enter custom —</div>
            <div class="popup-fields">
              <input type="text" id="popup-code" placeholder="Course code" value="${esc(cell?.code || "")}">
              <input type="text" id="popup-name" placeholder="Course name" value="${esc(cell?.name || "")}">
              <div class="popup-row">
                <input type="text" id="popup-room" placeholder="Room" value="${esc(cell?.room || "")}">
                <input type="time" id="popup-start" value="${cell?.start || slot.start}">
                <span class="time-sep">–</span>
                <input type="time" id="popup-end" value="${cell?.end || TIME_SLOTS[Math.min(ti + 3, TIME_SLOTS.length - 1)].end}">
              </div>
            </div>
            <div class="popup-actions">
              <button class="btn btn-primary" id="popup-save">✓ Save</button>
              ${cell ? '<button class="btn" id="popup-clear" style="color:var(--danger)">✕ Clear</button>' : ""}
              <button class="btn" id="popup-cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    // Remove any existing popup
    document.getElementById("cell-popup-overlay")?.remove();
    document.body.insertAdjacentHTML("beforeend", html);

    // Events
    const overlay = document.getElementById("cell-popup-overlay");
    const search = document.getElementById("popup-search");

    renderList("");
    search.addEventListener("input", () => renderList(search.value));
    search.focus();

    // Close handlers
    const close = () => {
      overlay.remove();
      popupTarget = null;
    };
    overlay.querySelector(".popup-close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.getElementById("popup-cancel").addEventListener("click", close);

    // Save
    document.getElementById("popup-save").addEventListener("click", () => {
      const name = document.getElementById("popup-name").value.trim();
      if (!name) return;
      const code = document.getElementById("popup-code").value.trim();
      const room = document.getElementById("popup-room").value.trim();
      const start = document.getElementById("popup-start").value;
      const end = document.getElementById("popup-end").value;
      fillSlots(ti, di, start, end, {
        code,
        name,
        room,
        start,
        end,
        source: "manual",
      });
      close();
      renderGrid();
    });

    // Clear
    document.getElementById("popup-clear")?.addEventListener("click", () => {
      clearCell(ti, di);
      close();
      renderGrid();
    });

    // Keyboard
    document.addEventListener("keydown", function escHandler(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", escHandler);
      }
    });
  }

  function closePopup() {
    document.getElementById("cell-popup-overlay")?.remove();
    popupTarget = null;
  }

  // ── Exam Schedule ───────────────────────────────────────────────
  function renderExamSchedule() {
    const container = document.getElementById("exam-schedule");
    if (!container || !courseData?.years?.[activeYear]?.courses) {
      if (container) container.innerHTML = "";
      return;
    }
    const exams = courseData.years[activeYear].courses.filter(
      (c) => c.midterm || c.final,
    );
    if (exams.length === 0) {
      container.innerHTML = '<p class="empty-hint">No exam dates.</p>';
      return;
    }
    function fd(d) {
      if (!d) return "—";
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return d;
      const m = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${dt.getDate()} ${m[dt.getMonth()]} ${dt.getFullYear()}`;
    }
    let h =
      '<table class="weekly-table"><thead><tr><th>Course</th><th>Midterm</th><th>Final</th></tr></thead><tbody>';
    for (const c of exams) {
      h += `<tr><td class="course-col"><span class="course-name">${esc(c.name)}</span>${c.code ? `<span class="course-code">${esc(c.code)}</span>` : ""}</td><td>${fd(c.midterm)}</td><td>${fd(c.final)}</td></tr>`;
    }
    h += "</tbody></table>";
    container.innerHTML = h;
  }

  // ── Regis Link ──────────────────────────────────────────────────
  function buildRegisLink() {
    const year = document.getElementById("regis-year")?.value || "2569";
    const sem = document.getElementById("regis-semester")?.value || "1";
    return `https://regis.reg.kmitl.ac.th/#/teach_table?mode=by_class&selected_year=${year}&selected_semester=${sem}&selected_faculty=01&selected_department=05&selected_curriculum=127&selected_class_year=${activeYear}&search_all_faculty=false&search_all_department=false&search_all_curriculum=false&search_all_class_year=false`;
  }
  function updateRegisLink() {
    const link = document.getElementById("regis-link");
    if (link) link.href = buildRegisLink();
  }

  // ── ICS Export ──────────────────────────────────────────────────
  function pad2(n) {
    return String(n).padStart(2, "0");
  }
  function toICSDate(d) {
    return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}T${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
  }
  function generateICS() {
    const entries = [];
    for (let ti = 0; ti < TIME_SLOTS.length; ti++) {
      for (let di = 0; di < DAYS.length; di++) {
        const cell = grid[ti][di];
        if (!cell) continue;
        const span = getSpan(ti, di);
        if (!span.isFirst) continue;
        entries.push({
          ...cell,
          day: di,
          start: cell.start || TIME_SLOTS[ti].start,
          end: cell.end || TIME_SLOTS[ti].end,
        });
      }
    }
    if (!entries.length) {
      alert("No courses to export.");
      return;
    }
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//CEI Resources//Timetable//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:CEI Timetable",
      "X-WR-TIMEZONE:Asia/Bangkok",
    ];
    const now = new Date();
    const nm = new Date(now);
    nm.setDate(nm.getDate() + ((8 - nm.getDay()) % 7));
    nm.setHours(0, 0, 0, 0);
    const se = new Date(nm);
    se.setMonth(se.getMonth() + 5);
    for (const c of entries) {
      const [sh, sm] = c.start.split(":").map(Number);
      const [eh, em] = c.end.split(":").map(Number);
      const ds = new Date(nm);
      ds.setDate(ds.getDate() + c.day);
      ds.setHours(sh, sm, 0);
      const de = new Date(nm);
      de.setDate(de.getDate() + c.day);
      de.setHours(eh, em, 0);
      const rrule = `FREQ=WEEKLY;UNTIL=${toICSDate(se).replace(/T.*/, "T235959Z")};BYDAY=${DAYS_SHORT[c.day].substring(0, 2).toUpperCase()}`;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${c.code || "x"}_${c.day}_${c.start}@cei`,
        `DTSTART:${toICSDate(ds)}`,
        `DTEND:${toICSDate(de)}`,
        `SUMMARY:${c.code || ""}: ${c.name || "Course"}`,
        c.room ? `LOCATION:${c.room}` : "",
        `RRULE:${rrule}`,
        "END:VEVENT",
      );
    }
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cei_timetable.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // ── Events ──────────────────────────────────────────────────────
  function setupEvents() {
    ["regis-year", "regis-semester"].forEach((id) => {
      document.getElementById(id)?.addEventListener("change", updateRegisLink);
    });
    document
      .getElementById("btn-export-ics")
      ?.addEventListener("click", generateICS);
  }

  function esc(s) {
    if (!s) return "";
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  // ── Init ────────────────────────────────────────────────────────
  async function init() {
    await loadCourseData();
    loadGrid();
    const hasData = grid.some((row) => row.some((cell) => cell !== null));
    if (!hasData) populateFromJSON();
    setupEvents();
    renderYearTabs();
    renderGrid();
    renderExamSchedule();
    updateRegisLink();
  }

  return { init };
})();
