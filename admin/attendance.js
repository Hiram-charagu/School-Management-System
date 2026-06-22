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

const rows = read("umma_lecturer_attendance_records");
const tbody = document.getElementById("dataRows");
tbody.innerHTML = rows.length
  ? rows
      .slice()
      .reverse()
      .map((r) => `<tr><td>${r.studentId}</td><td>${r.unitCode}</td><td>${r.status}</td><td>${r.updated || r.sessionDate}</td></tr>`)
      .join("")
  : "<tr><td colspan='4'>No attendance records yet.</td></tr>";
