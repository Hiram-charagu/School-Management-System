if (localStorage.getItem("umma_user_role") !== "admin") {
  window.location.href = "../auth/login.html?portal=admin";
}

const KEY = "umma_announcements";

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (value) => localStorage.setItem(KEY, JSON.stringify(value));

let announcements = read();

const today = () => new Date().toISOString().slice(0, 10);
const weekAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
};

const renderSummary = () => {
  const week = weekAgo();
  document.getElementById("totalAnnouncements").textContent = String(announcements.length);
  document.getElementById("publicAnnouncements").textContent = String(
    announcements.filter((a) => a.audience === "all").length
  );
  document.getElementById("recentAnnouncements").textContent = String(
    announcements.filter((a) => a.updated >= week).length
  );
};

const render = () => {
  const tbody = document.getElementById("dataRows");
  tbody.innerHTML = announcements.length
    ? announcements
        .slice()
        .reverse()
        .map(
          (a) => `<tr>
          <td>${a.id}</td>
          <td>${a.title}</td>
          <td><span class='badge'>${a.audience}</span></td>
          <td>${a.by}</td>
          <td>${a.updated}</td>
          <td><button class='link-btn' data-remove='${a.id}'>Delete</button></td>
        </tr>`
        )
        .join("")
    : "<tr><td colspan='6'>No announcements posted yet.</td></tr>";
  renderSummary();
};

render();

document.getElementById("announcementForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const audience = document.getElementById("audience").value;
  const body = document.getElementById("body").value.trim();
  const by = localStorage.getItem("umma_user_name") || "admin@alsuhaim.edu";

  if (!title || !body) return;

  announcements.push({
    id: `ANN-${Date.now()}`,
    audience,
    title,
    body,
    updated: today(),
    by,
  });

  write(announcements);
  render();
  e.target.reset();
});

document.getElementById("dataRows")?.addEventListener("click", (e) => {
  const id = e.target.dataset.remove;
  if (!id) return;
  announcements = announcements.filter((a) => a.id !== id);
  write(announcements);
  render();
});
