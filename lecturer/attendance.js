const ATTENDANCE_KEY = "umma_lecturer_attendance_records";
const ALLOC_KEY = "umma_lecturer_unit_allocations";
const STUDENTS_KEY = "umma_students";
const REG_KEY = "umma_student_registered_units";

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

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

const today = new Date().toISOString().slice(0, 10);
document.getElementById("sessionDate").value = today;

let students = read(STUDENTS_KEY);
if (!students.length) {
  students = [
    { id: "STU-001", name: "Ayan Yusuf", className: "BSCS Y2", updated: today },
    { id: "STU-002", name: "Halima Noor", className: "BBIT Y1", updated: today },
  ];
  write(STUDENTS_KEY, students);
}
const allocations = read(ALLOC_KEY).filter((a) => a.staffNo === profile.staffNo);
let regs = read(REG_KEY);

// Seed lightweight student registrations if empty
if ((Array.isArray(regs) || !Object.keys(regs).length) && students.length && allocations.length) {
  const regMap = {};
  students.forEach((s, idx) => {
    const studentKey = (s.email || s.id).toLowerCase();
    regMap[studentKey] = allocations.slice(0, 2).map((a) => a.unitCode);
  });
  write(REG_KEY, regMap);
  regs = read(REG_KEY);
}

const unitSelect = document.getElementById("unitCode");
unitSelect.innerHTML = allocations.length
  ? allocations.map((a) => `<option value='${a.unitCode}'>${a.unitCode} - ${a.unitName}</option>`).join("")
  : "<option value=''>No allocated units</option>";

const studentSelect = document.getElementById("studentRegNo");
const bindStudents = () => {
  const code = unitSelect.value;
  const unitStudents = students.filter((s) => {
    const studentKey = (s.email || s.id).toLowerCase();
    const regCodes = Array.isArray(regs[studentKey]) ? regs[studentKey] : [];
    return regCodes.includes(code);
  });
  studentSelect.innerHTML = unitStudents.length
    ? unitStudents.map((s) => `<option value='${s.id}'>${s.id} - ${s.name}</option>`).join("")
    : "<option value=''>No students registered in this unit</option>";
};

unitSelect.addEventListener("change", bindStudents);
bindStudents();

let records = read(ATTENDANCE_KEY).filter((r) => r.staffNo === profile.staffNo);

const renderSummary = () => {
  const present = records.filter((r) => r.status === "Present").length;
  const absent = records.filter((r) => r.status === "Absent").length;
  document.getElementById("totalMarks").textContent = String(records.length);
  document.getElementById("presentMarks").textContent = String(present);
  document.getElementById("absentMarks").textContent = String(absent);
};

const renderRows = () => {
  const tbody = document.getElementById("dataRows");
  tbody.innerHTML = records.length
    ? records
        .slice()
        .reverse()
        .map(
          (r) =>
            `<tr><td>${r.sessionDate}</td><td>${r.studentId}</td><td>${r.unitCode}</td><td><span class='badge'>${r.status}</span></td><td>${r.lecturerName}</td></tr>`
        )
        .join("")
    : "<tr><td colspan='5'>No attendance records yet.</td></tr>";
};

const renderAll = () => {
  renderSummary();
  renderRows();
};

renderAll();

document.getElementById("attendanceForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const studentId = studentSelect.value;
  const unitCode = unitSelect.value;
  const sessionDate = document.getElementById("sessionDate").value;
  const status = document.getElementById("status").value;
  if (!studentId || !unitCode || !sessionDate) return;

  const duplicate = records.find((r) => r.studentId === studentId && r.unitCode === unitCode && r.sessionDate === sessionDate);
  if (duplicate) {
    duplicate.status = status;
  } else {
    records.push({
      id: `ATT-${Date.now()}`,
      staffNo: profile.staffNo,
      lecturerName: profile.fullName || "Lecturer",
      studentId,
      unitCode,
      sessionDate,
      status,
      updated: today,
    });
  }

  const all = read(ATTENDANCE_KEY).filter((r) => r.staffNo !== profile.staffNo).concat(records);
  write(ATTENDANCE_KEY, all);
  renderAll();
});
