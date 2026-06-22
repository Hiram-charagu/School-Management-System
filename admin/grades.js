if (localStorage.getItem("umma_user_role") !== "admin") {
  window.location.href = "../auth/login.html?portal=admin";
}

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const rows = read("umma_grades");
const tbody = document.getElementById("dataRows");

tbody.innerHTML = rows.length
  ? rows
      .slice()
      .reverse()
      .map((r) => `<tr><td>${r.studentId}</td><td>${r.unitCode}</td><td>${r.score}</td><td><span class='badge'>${r.grade}</span></td><td>${r.updated}</td></tr>`)
      .join("")
  : "<tr><td colspan='5'>No grades submitted by lecturers yet.</td></tr>";
