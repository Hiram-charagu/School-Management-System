const KEY = "umma_students";
const STUDENT_REG_KEY = "umma_student_registered_units";

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const write = (value) => localStorage.setItem(KEY, JSON.stringify(value));
const readAny = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const writeAny = (key, value) => localStorage.setItem(key, JSON.stringify(value));

if (localStorage.getItem("umma_user_role") !== "admin") {
  window.location.href = "../auth/login.html?portal=admin";
}

let students = read();
if (!students.length) {
  students = [
    { id: "STU-001", name: "Ayan Yusuf", email: "student@alsuhaim.edu", className: "BSCS Y2", updated: "2026-03-03" },
    { id: "STU-002", name: "Halima Noor", email: "student2@alsuhaim.edu", className: "BBIT Y1", updated: "2026-03-03" },
  ];
  write(students);
}

const render = () => {
  const tbody = document.getElementById("dataRows");
  tbody.innerHTML = students.length
    ? students
        .map(
          (s) => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.email || "-"}</td><td>${s.className}</td><td>${s.updated}</td><td><button class='link-btn' data-edit='${s.id}'>Edit</button> <button class='link-btn' data-remove='${s.id}'>Delete</button></td></tr>`
        )
        .join("")
    : "<tr><td colspan='6'>No students found.</td></tr>";
};

render();

document.getElementById("studentForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("studentId").value.trim().toUpperCase();
  const name = document.getElementById("studentName").value.trim();
  const email = document.getElementById("studentEmail").value.trim().toLowerCase();
  const className = document.getElementById("studentClass").value.trim();
  if (!id || !name || !email || !className) return;

  const idx = students.findIndex((s) => s.id === id);
  const payload = { id, name, email, className, updated: new Date().toISOString().slice(0, 10) };
  if (idx >= 0) students[idx] = payload;
  else students.push(payload);
  write(students);
  render();
  e.target.reset();
  document.getElementById("studentId").readOnly = false;
});

document.getElementById("dataRows")?.addEventListener("click", (e) => {
  const removeId = e.target.dataset.remove;
  const editId = e.target.dataset.edit;
  
  if (removeId) {
    students = students.filter((s) => s.id !== removeId);
    write(students);
    render();
  }
  
  if (editId) {
    const student = students.find((s) => s.id === editId);
    if (student) {
      document.getElementById("studentId").value = student.id;
      document.getElementById("studentName").value = student.name;
      document.getElementById("studentEmail").value = student.email || "";
      document.getElementById("studentClass").value = student.className;
      document.getElementById("studentId").readOnly = true;
    }
  }
});

document.getElementById("revokeForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentId = document.getElementById("revokeStudentId").value.trim().toUpperCase();
  const unitCode = document.getElementById("revokeUnitCode").value.trim().toUpperCase();
  const notice = document.getElementById("revokeNotice");
  if (!studentId || !unitCode) return;

  const target = students.find((s) => s.id === studentId);
  if (!target) {
    notice.textContent = `Student ${studentId} not found.`;
    return;
  }

  const regMap = readAny(STUDENT_REG_KEY, {});
  let changed = false;
  Object.keys(regMap).forEach((k) => {
    const list = Array.isArray(regMap[k]) ? regMap[k] : [];
    const keyMatch = k.includes(studentId.toLowerCase()) || (target.email && k.includes(target.email.toLowerCase()));
    if (keyMatch && list.includes(unitCode)) {
      regMap[k] = list.filter((c) => c !== unitCode);
      changed = true;
    }
  });

  writeAny(STUDENT_REG_KEY, regMap);
  notice.textContent = changed
    ? `Admin override applied: ${unitCode} removed for ${studentId}.`
    : `No matching registration found for ${studentId} and ${unitCode}.`;
});
