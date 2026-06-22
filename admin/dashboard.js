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

const students = read("umma_students");
const lecturers = read("umma_accounts").filter((a) => a.role === "lecturer");
const units = read("umma_admin_units_offered");
const grades = read("umma_grades");

const cards = document.querySelectorAll(".card h3");
if (cards[0]) cards[0].textContent = `${students.length} Students`;
if (cards[1]) cards[1].textContent = `${lecturers.length} Lecturers`;
if (cards[2]) cards[2].textContent = `${units.filter((u) => u.offered).length} Open Units`;

const tbody = document.getElementById("dataRows");
tbody.innerHTML = grades.length
  ? grades
      .slice()
      .reverse()
      .map((g) => `<tr><td>${g.studentId}</td><td>${g.unitCode}</td><td>${g.grade}</td><td>${g.updated}</td></tr>`)
      .join("")
  : "<tr><td colspan='4'>No grade activity yet.</td></tr>";
