/**
 * CEI Timetable — Google Calendar-style week view
 * 7-day columns, continuous time axis, absolute-positioned events
 */

const Timetable = (() => {
  const STORAGE_KEY = "cei_cal_v1";
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

  const HOUR_HEIGHT = 64; // px per hour
  const START_HOUR = 7; // 7:00
  const END_HOUR = 21; // 21:00
  const TOTAL_HOURS = END_HOUR - START_HOUR;

  // ── State ───────────────────────────────────────────────────────
  let courseData = null;
  let activeYear = "1";
  let grid = []; // flat list of {code,name,room,start,end,day,source}

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

  // ── Persistence ─────────────────────────────────────────────────
  function loadGrid() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        grid = JSON.parse(raw);
        return;
      }
    } catch (e) {}
    grid = [];
  }

  function saveGrid() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
  }

  function populateFromJSON() {
    if (!courseData?.years?.[activeYear]?.courses) return;
    const raw = courseData.years[activeYear].courses
      .filter(
        (c) =>
          c.day !== null && c.day !== undefined && c.start && c.end && c.name,
      )
      .map((c) => ({
        code: c.code || "",
        name: c.name,
        room: c.room || "",
        start: c.start,
        end: c.end,
        day: c.day,
        section: c.section || "",
        source: "regis",
      }));

    // Merge split-session entries (same code+day+section, hasBreak=true)
    // Different sections stay separate
    const merged = [];
    const groups = {};
    for (const c of raw) {
      const key = `${c.code}|${c.day}|${c.section || ""}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(c);
    }
    for (const items of Object.values(groups)) {
      if (items.length === 1) {
        merged.push(items[0]);
      } else {
        const starts = items.map((i) => i.start).sort();
        const ends = items.map((i) => i.end).sort();
        merged.push({
          ...items[0],
          start: starts[0],
          end: ends[ends.length - 1],
          hasBreak: true,
        });
      }
    }
    grid = merged;
    saveGrid();
  }

  function timeToPx(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return (h - START_HOUR) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
  }

  function durationPx(startStr, endStr) {
    return timeToPx(endStr) - timeToPx(startStr);
  }

  function pxToTime(px) {
    const totalMin = (px / HOUR_HEIGHT) * 60 + START_HOUR * 60;
    const h = Math.floor(totalMin / 60);
    const m = Math.round(totalMin % 60);
    return `${String(Math.min(h, 23)).padStart(2, "0")}:${String(Math.min(m, 59)).padStart(2, "0")}`;
  }

  // ── Available courses ───────────────────────────────────────────
  function getAvailableCourses() {
    if (!courseData?.years?.[activeYear]?.courses) return [];
    return courseData.years[activeYear].courses.filter((c) => c.name && c.code);
  }

  function getGenEdCourses() {
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
        populateFromJSON();
        renderYearTabs();
        renderCalendar();
        renderExamSchedule();
        updateRegisLink();
      }),
    );
  }

  // ── Render: Google Calendar Grid ────────────────────────────────
  function renderCalendar() {
    const container = document.getElementById("weekly-timetable");
    if (!container) return;

    const totalHeight = TOTAL_HOURS * HOUR_HEIGHT;

    let html =
      '<div class="cal-scroll"><div class="cal-grid" style="height:' +
      totalHeight +
      'px">';

    // Time gutter
    html += '<div class="cal-gutter">';
    for (let h = START_HOUR; h <= END_HOUR; h++) {
      html += `<div class="cal-hour" style="top:${(h - START_HOUR) * HOUR_HEIGHT}px">${String(h).padStart(2, "0")}:00</div>`;
    }
    html += "</div>";

    // Day columns
    for (let di = 0; di < DAYS.length; di++) {
      html += `<div class="cal-col" data-day="${di}">`;
      // Hour lines
      for (let h = START_HOUR; h <= END_HOUR; h++) {
        html += `<div class="cal-hour-line" style="top:${(h - START_HOUR) * HOUR_HEIGHT}px"></div>`;
      }
      // Half-hour lines
      for (let h = START_HOUR; h < END_HOUR; h++) {
        html += `<div class="cal-half-line" style="top:${(h - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2}px"></div>`;
      }
      // Events for this day
      const dayCourses = grid.filter((c) => c.day === di);
      for (const c of dayCourses) {
        const top = timeToPx(c.start);
        const height = Math.max(durationPx(c.start, c.end), 20);
        html += `<div class="cal-event${c.source === "manual" ? " manual" : ""}${c.hasBreak ? " has-break" : ""}" style="top:${top}px;height:${height}px" data-day="${di}" data-start="${c.start}" data-end="${c.end}">
          <div class="cal-event-code">${esc(c.code)}${c.hasBreak ? " ⏸" : ""}</div>
          <div class="cal-event-name">${esc(c.name)}</div>
          ${c.room ? `<div class="cal-event-room">${esc(c.room)}</div>` : ""}
          <button class="cal-event-pen" data-day="${di}" data-start="${c.start}" title="Edit">✏️</button>
        </div>`;
      }
      html += "</div>";
    }

    html += "</div></div>";
    container.innerHTML = html;

    attachCalendarEvents();
  }

  function attachCalendarEvents() {
    const ct = document.getElementById("weekly-timetable");
    if (!ct) return;

    // Pen click → edit popup
    ct.querySelectorAll(".cal-event-pen").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const day = parseInt(btn.dataset.day);
        openPopup(day, btn.dataset.start, btn.dataset.end, btn.parentElement);
      });
    });

    // Event click → edit popup
    ct.querySelectorAll(".cal-event").forEach((ev) => {
      ev.addEventListener("click", (e) => {
        if (e.target.closest(".cal-event-pen")) return;
        const day = parseInt(ev.dataset.day);
        openPopup(day, ev.dataset.start, ev.dataset.end, ev);
      });
      // Long press on mobile
      let timer;
      ev.addEventListener(
        "touchstart",
        (e) => {
          timer = setTimeout(() => {
            const day = parseInt(ev.dataset.day);
            openPopup(day, ev.dataset.start, ev.dataset.end, ev);
          }, 500);
        },
        { passive: true },
      );
      ev.addEventListener("touchend", () => clearTimeout(timer));
      ev.addEventListener("touchmove", () => clearTimeout(timer));
    });

    // Click on empty column area → add at that time
    ct.querySelectorAll(".cal-col").forEach((col) => {
      col.addEventListener("click", (e) => {
        if (e.target.closest(".cal-event")) return;
        const rect = col.getBoundingClientRect();
        const y = e.clientY - rect.top + col.scrollTop;
        const start = pxToTime(y);
        const end = pxToTime(y + HOUR_HEIGHT);
        const day = parseInt(col.dataset.day);
        openPopup(day, start, end, null);
      });
    });
  }

  // ── Popup ───────────────────────────────────────────────────────
  function openPopup(day, start, end, existingEvent) {
    // Filter courses that match this day + time slot
    const allCourses = getAvailableCourses();
    const genedCourses = getGenEdCourses();

    function matchesSlot(c) {
      return (
        c.day === day && c.start && c.end && c.start <= start && c.end >= start
      );
    }
    const courses = allCourses.filter(matchesSlot);
    const gened = genedCourses.filter(matchesSlot);

    // Find existing course if any
    const existing = existingEvent
      ? grid.find((c) => c.day === day && c.start === start && c.end === end)
      : null;

    let html = `<div class="popup-overlay visible" id="cell-popup-overlay">
      <div class="popup-card">
        <div class="popup-header">
          <span>${DAYS[day]} ${start}–${end}</span>
          <button class="popup-close">&times;</button>
        </div>
        <div class="popup-body">
          <input type="text" class="popup-search" id="popup-search" placeholder="🔍 Search courses..." autocomplete="off">
          <div class="popup-list" id="popup-list"></div>
          <div class="popup-custom">
            <div class="popup-custom-title">— or enter custom —</div>
            <div class="popup-fields">
              <input type="text" id="popup-code" placeholder="Course code" value="${esc(existing?.code || "")}">
              <input type="text" id="popup-name" placeholder="Course name" value="${esc(existing?.name || "")}">
              <div class="popup-row">
                <input type="text" id="popup-room" placeholder="Room" value="${esc(existing?.room || "")}">
                <input type="time" id="popup-start" value="${existing?.start || start}">
                <span class="time-sep">–</span>
                <input type="time" id="popup-end" value="${existing?.end || end}">
              </div>
            </div>
            <div class="popup-actions">
              <button class="btn btn-primary" id="popup-save">✓ Save</button>
              ${existing ? '<button class="btn" id="popup-clear" style="color:var(--danger)">✕ Remove</button>' : ""}
              <button class="btn" id="popup-cancel">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>`;

    document.getElementById("cell-popup-overlay")?.remove();
    document.body.insertAdjacentHTML("beforeend", html);

    const overlay = document.getElementById("cell-popup-overlay");
    const searchEl = document.getElementById("popup-search");

    function renderList(filter = "") {
      const list = document.getElementById("popup-list");
      if (!list) return;
      const q = filter.toLowerCase();
      const major = courses.filter((c) => c.tag !== "GenEd");
      const mf = major.filter(
        (c) =>
          !q ||
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q),
      );
      const gf = gened.filter(
        (c) =>
          !q ||
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q),
      );

      let h = "";
      if (mf.length) {
        h += '<div class="popup-section-title">📚 Major</div>';
        h += mf
          .map(
            (c) =>
              `<div class="popup-item" data-code="${esc(c.code)}"><span class="popup-item-code">${esc(c.code)}</span><span class="popup-item-name">${esc(c.name)}</span><span class="popup-item-meta">${esc(c.room || "")} ${c.start || ""}–${c.end || ""}</span></div>`,
          )
          .join("");
      }
      if (gf.length) {
        h += '<div class="popup-section-title">🎓 GenEd</div>';
        h += gf
          .map(
            (c) =>
              `<div class="popup-item gened-item" data-code="${esc(c.code)}"><span class="popup-item-code">${esc(c.code)}</span><span class="popup-item-name">${esc(c.name)}</span><span class="popup-item-meta">${esc(c.room || "")} ${c.start || ""}–${c.end || ""}</span></div>`,
          )
          .join("");
      }
      list.innerHTML =
        h || '<div class="popup-empty">No matches — use custom</div>';

      list.querySelectorAll(".popup-item").forEach((item) => {
        item.addEventListener("click", () => {
          const code = item.dataset.code;
          const course = [...courses, ...gened].find((c) => c.code === code);
          if (course) {
            addOrUpdate(day, course.start || start, course.end || end, {
              code: course.code,
              name: course.name,
              room: course.room || "",
              source: "regis",
            });
            overlay.remove();
            renderCalendar();
          }
        });
      });
    }

    renderList("");
    searchEl.addEventListener("input", () => renderList(searchEl.value));
    searchEl.focus();

    const close = () => {
      overlay.remove();
    };
    overlay.querySelector(".popup-close").addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    document.getElementById("popup-cancel").addEventListener("click", close);

    document.getElementById("popup-save").addEventListener("click", () => {
      const name = document.getElementById("popup-name").value.trim();
      if (!name) return;
      addOrUpdate(
        day,
        document.getElementById("popup-start").value,
        document.getElementById("popup-end").value,
        {
          code: document.getElementById("popup-code").value.trim(),
          name,
          room: document.getElementById("popup-room").value.trim(),
          source: "manual",
        },
      );
      close();
      renderCalendar();
    });

    document.getElementById("popup-clear")?.addEventListener("click", () => {
      grid = grid.filter(
        (c) => !(c.day === day && c.start === start && c.end === end),
      );
      saveGrid();
      close();
      renderCalendar();
    });

    document.addEventListener("keydown", function escH(e) {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", escH);
      }
    });
  }

  function addOrUpdate(day, start, end, data) {
    // Remove any existing course at this exact slot
    grid = grid.filter(
      (c) => !(c.day === day && c.start === start && c.end === end),
    );
    grid.push({ day, start, end, ...data });
    saveGrid();
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
    if (!exams.length) {
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
    if (!grid.length) {
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
    for (const c of grid) {
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

  async function init() {
    await loadCourseData();
    loadGrid();
    if (!grid.length) populateFromJSON();
    setupEvents();
    renderYearTabs();
    renderCalendar();
    renderExamSchedule();
    updateRegisLink();
  }

  return { init };
})();
