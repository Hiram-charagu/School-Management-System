if (localStorage.getItem("umma_user_role") !== "lecturer") {
  window.location.href = "../auth/login.html?portal=lecturer";
}

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const announcements = read("umma_announcements");
const lecturerAnnouncements = announcements.filter((a) => a.audience === "all" || a.audience === "lecturers");

const tbody = document.getElementById("dataRows");
tbody.innerHTML = lecturerAnnouncements.length
  ? lecturerAnnouncements
      .slice()
      .reverse()
      .map((r) => `<tr><td>${r.id}</td><td>${r.title}</td><td><span class='badge'>${r.audience}</span></td><td>${r.updated}</td></tr>`)
      .join("")
  : "<tr><td colspan='4'>No announcements available.</td></tr>";
