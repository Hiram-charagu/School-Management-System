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

const rows = read("umma_announcements");
const tbody = document.getElementById("dataRows");
tbody.innerHTML = rows.length
  ? rows.map((r) => `<tr><td>${r.id}</td><td>${r.title}</td><td>${r.audience}</td><td>${r.updated}</td></tr>`).join("")
  : "<tr><td colspan='4'>No announcements available.</td></tr>";
