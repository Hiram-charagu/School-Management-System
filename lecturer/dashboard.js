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

const profile = (() => {
  try {
    return JSON.parse(localStorage.getItem("umma_lecturer_profile") || "{}");
  } catch {
    return {};
  }
})();

const alloc = read("umma_lecturer_unit_allocations").filter((a) => a.staffNo === profile.staffNo);
const attendance = read("umma_lecturer_attendance_records").filter((r) => r.staffNo === profile.staffNo);
const grades = read("umma_grades").filter((g) => g.lecturerStaffNo === profile.staffNo);

const cards = document.querySelectorAll(".card h3");
if (cards[0]) cards[0].textContent = profile.fullName || "Lecturer";
if (cards[1]) cards[1].textContent = `${alloc.length} allocated units`;
if (cards[2]) cards[2].textContent = `${grades.length} grades entered`;

const tbody = document.getElementById("dataRows");
const rows = alloc.map((a) => ({
  id: a.unitCode,
  name: a.unitName,
  status: `${attendance.filter((r) => r.unitCode === a.unitCode).length} attendance marks`,
  updated: a.updated,
}));

tbody.innerHTML = rows.length
  ? rows.map((r) => `<tr><td>${r.id}</td><td>${r.name}</td><td>${r.status}</td><td>${r.updated}</td></tr>`).join("")
  : "<tr><td colspan='4'>No allocated units yet. Open My Classes.</td></tr>";
