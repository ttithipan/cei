/**
 * CEI3 Courses — Course cards from courses.json + data/course_meta.json
 * Platform info is static, filled once per semester in course_meta.json
 */

const CoursesModule = (() => {
  let coursesData = null;
  let metaData = null;

  const PLATFORM_COLORS = {
    "Line Group": { bg: "#e8f5e9", fg: "#2e7d32", dot: "#06C755" },
    "Microsoft Teams": { bg: "#ede7f6", fg: "#4527a0", dot: "#6264A7" },
    goedu: { bg: "#e3f2fd", fg: "#1565c0", dot: "#1976d2" },
    Discord: { bg: "#e8eaf6", fg: "#283593", dot: "#5865F2" },
    Zoom: { bg: "#e0f2f1", fg: "#00695c", dot: "#2D8CFF" },
    "Google Classroom": { bg: "#fff3e0", fg: "#e65100", dot: "#FBBC04" },
    Other: { bg: "#f3e5f5", fg: "#6a1b9a", dot: "#9c27b0" },
  };

  function platformBadge(platform) {
    if (!platform) return "";
    const c = PLATFORM_COLORS[platform] || PLATFORM_COLORS["Other"];
    return `<span class="platform-badge" style="--plt-bg:${c.bg};--plt-fg:${c.fg};--plt-dot:${c.dot}"><span class="platform-dot" style="background:${c.dot}"></span>${esc(platform)}</span>`;
  }

  async function load() {
    const [coursesResp, metaResp] = await Promise.all([
      fetch("data/courses.json"),
      fetch("data/course_meta.json"),
    ]);
    if (coursesResp.ok) coursesData = await coursesResp.json();
    if (metaResp.ok) metaData = await metaResp.json();
  }

  function getYearCourses(year) {
    if (!coursesData?.years?.[year]?.courses) return [];
    const seen = new Map();
    for (const c of coursesData.years[year].courses) {
      if (c.code && !seen.has(c.code)) {
        seen.set(c.code, c);
      }
    }
    return [...seen.values()];
  }

  function getMeta(code) {
    return (metaData && metaData[code]) || null;
  }

  function render() {
    const container = document.getElementById("courses-grid");
    if (!container) return;

    const courses = getYearCourses("3");

    if (!courses.length) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No courses found for Year 3.</p>
          <p class="hint">Run <code>python scripts/fetch_regis.py</code> to scrape timetable data.</p>
        </div>`;
      return;
    }

    let html = "";
    for (const c of courses) {
      const meta = getMeta(c.code);
      const platform = meta?.platform || null;
      const detail = meta?.platform_detail || null;
      const notes = meta?.notes || null;
      const hasMeta = !!(platform || detail || notes);

      html += `
      <div class="course-card${!hasMeta ? " empty" : ""}">
        <div class="course-card-top">
          <span class="course-card-code">${esc(c.code || "")}</span>
          ${platformBadge(platform)}
        </div>
        <div class="course-card-name">${esc(c.name || "")}</div>
        ${detail ? `<div class="course-card-detail">🔍 Search: ${esc(detail)}</div>` : ""}
        ${notes ? `<div class="course-card-notes">${esc(notes)}</div>` : ""}
        ${c.teacher ? `<div class="course-card-teacher">👤 ${esc(c.teacher)}</div>` : ""}
        ${c.room ? `<div class="course-card-room">📍 ${esc(c.room)}</div>` : ""}
        ${!hasMeta ? `<div class="course-card-missing">Add platform in <code>data/course_meta.json</code></div>` : ""}
      </div>`;
    }

    container.innerHTML = html;
  }

  function esc(s) {
    if (!s) return "";
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  return { load, render };
})();
