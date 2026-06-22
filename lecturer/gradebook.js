const ALLOC_KEY = "umma_lecturer_unit_allocations";
const REG_KEY = "umma_student_registered_units";
const GRADE_KEY = "umma_grades";
const STUDENTS_KEY = "umma_students";

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const calcGrade = (score) => {
  const s = Number(score);
  if (s >= 70) return "A";
  if (s >= 60) return "B";
  if (s >= 50) return "C";
  if (s >= 40) return "D";
  return "E";
};

if (localStorage.getItem("umma_user_role") !== "lecturer") {
  window.location.href = "../auth/login.html?portal=lecturer";
}

const profile = (() => {
  try {
    return JSON.parse(localStorage.getItem("umma_lecturer_profile") || "{}");
  } catch {
    return {};
  }
})();

const allocations = read(ALLOC_KEY).filter((a) => a.staffNo === profile.staffNo);
const regs = read(REG_KEY);
let grades = read(GRADE_KEY);

const unitSelect = document.getElementById("unitCode");
unitSelect.innerHTML = allocations.length
  ? allocations.map((a) => `<option value='${a.unitCode}'>${a.unitCode} - ${a.unitName}</option>`).join("")
  : "<option value=''>No allocated units</option>";

const studentSelect = document.getElementById("studentId");
const bindStudents = () => {
  const code = unitSelect.value;
  const studentList = read(STUDENTS_KEY);
  const regMap = read(REG_KEY);
  const students = studentList.filter((s) => {
    const studentKey = (s.email || s.id).toLowerCase();
    const regCodes = Array.isArray(regMap[studentKey]) ? regMap[studentKey] : [];
    return regCodes.includes(code);
  });
  studentSelect.innerHTML = students.length
    ? students.map((s) => `<option value='${s.id}'>${s.id} - ${s.name}</option>`).join("")
    : "<option value=''>No registered students</option>";
};
unitSelect.addEventListener("change", bindStudents);
bindStudents();

const myGrades = () => grades.filter((g) => g.lecturerStaffNo === profile.staffNo);

const render = () => {
  const mine = myGrades();
  const tbody = document.getElementById("dataRows");
  tbody.innerHTML = mine.length
    ? mine
        .slice()
        .reverse()
        .map(
          (g) =>
            `<tr><td>${g.studentId}</td><td>${g.unitCode}</td><td>${g.score}</td><td><span class='badge'>${g.grade}</span></td><td>${g.updated}</td></tr>`
        )
        .join("")
    : "<tr><td colspan='5'>No grades entered yet.</td></tr>";

  document.getElementById("totalEntries").textContent = String(mine.length);
  const avg = mine.length ? Math.round(mine.reduce((a, b) => a + Number(b.score), 0) / mine.length) : 0;
  document.getElementById("averageScore").textContent = String(avg);
};

render();

document.getElementById("gradeForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentId = studentSelect.value;
  const unitCode = unitSelect.value;
  const score = Number(document.getElementById("score").value);
  if (!studentId || !unitCode || Number.isNaN(score) || score < 0 || score > 100) return;

  const idx = grades.findIndex((g) => g.lecturerStaffNo === profile.staffNo && g.studentId === studentId && g.unitCode === unitCode);
  const entry = {
    id: `GR-${Date.now()}`,
    lecturerStaffNo: profile.staffNo,
    lecturerName: profile.fullName || "Lecturer",
    studentId,
    unitCode,
    score,
    grade: calcGrade(score),
    updated: new Date().toISOString().slice(0, 10),
  };

  if (idx >= 0) grades[idx] = { ...grades[idx], ...entry };
  else grades.push(entry);

  write(GRADE_KEY, grades);
  render();
});
