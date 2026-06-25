if (localStorage.getItem("umma_user_role") !== "admin") {
  window.location.href = "../auth/login.html?portal=admin";
}

window.UmmaData?.ensureSeed();

const KEY = "umma_accommodation_records";
const STUDENTS_KEY = "umma_students";

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const today = () => new Date().toISOString().slice(0, 10);

let records = read(KEY, []);
const students = read(STUDENTS_KEY, []);

const badge = (status) => `<span class='badge'>${status || "Pending"}</span>`;

const renderSummary = () => {
  document.getElementById("totalRequests").textContent = String(records.length);
  document.getElementById("approvedRequests").textContent = String(records.filter((r) => r.status === "Approved").length);
  document.getElementById("pendingRequests").textContent = String(records.filter((r) => r.status !== "Approved").length);
};

const renderRows = () => {
  const tbody = document.getElementById("dataRows");
  if (!tbody) return;

  tbody.innerHTML = records.length
    ? records
        .map(
          (record) => `<tr>
            <td>${record.studentId}</td>
            <td>${record.studentName || "-"}</td>
            <td>${record.hostel || "-"}</td>
            <td>${record.room || "-"}</td>
            <td>${record.bed || "-"}</td>
            <td>${record.package || "-"}</td>
            <td>${badge(record.status)}</td>
            <td>${record.checkIn || "-"}</td>
            <td>${record.updated || "-"}</td>
            <td>
              <button class='link-btn' data-edit='${record.id}'>Edit</button>
              <button class='link-btn' data-remove='${record.id}'>Delete</button>
            </td>
          </tr>`
        )
        .join("")
    : "<tr><td colspan='10'>No accommodation records found.</td></tr>";
};

const render = () => {
  renderSummary();
  renderRows();
};

const fillForm = (record) => {
  document.getElementById("studentId").value = record.studentId || "";
  document.getElementById("studentName").value = record.studentName || "";
  document.getElementById("hostel").value = record.hostel || "Jasmine Hall";
  document.getElementById("room").value = record.room || "";
  document.getElementById("bed").value = record.bed || "";
  document.getElementById("packageType").value = record.package || "Boarding - Standard";
  document.getElementById("status").value = record.status || "Pending";
  document.getElementById("checkIn").value = record.checkIn || today();
  document.getElementById("notes").value = record.notes || "";
  document.getElementById("studentId").readOnly = true;
};

const syncStudentName = () => {
  const id = document.getElementById("studentId").value.trim().toUpperCase();
  const match = students.find((student) => student.id === id);
  if (match && !document.getElementById("studentName").value.trim()) {
    document.getElementById("studentName").value = match.name || "";
  }
};

document.getElementById("studentId")?.addEventListener("blur", syncStudentName);

document.getElementById("accommodationForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const studentId = document.getElementById("studentId").value.trim().toUpperCase();
  const payload = {
    id: records.find((record) => record.studentId === studentId)?.id || `ACC-${Date.now()}`,
    studentId,
    studentName: document.getElementById("studentName").value.trim(),
    hostel: document.getElementById("hostel").value,
    room: document.getElementById("room").value.trim().toUpperCase(),
    bed: document.getElementById("bed").value.trim().toUpperCase(),
    package: document.getElementById("packageType").value,
    status: document.getElementById("status").value,
    checkIn: document.getElementById("checkIn").value,
    notes: document.getElementById("notes").value.trim(),
    updated: today(),
  };

  if (!payload.studentId || !payload.studentName || !payload.room || !payload.bed) return;

  const index = records.findIndex((record) => record.studentId === payload.studentId);
  if (index >= 0) records[index] = { ...records[index], ...payload };
  else records.push(payload);

  write(KEY, records);
  render();
  event.target.reset();
  document.getElementById("studentId").readOnly = false;
  document.getElementById("checkIn").value = today();
});

document.getElementById("dataRows")?.addEventListener("click", (event) => {
  const editId = event.target.dataset.edit;
  const removeId = event.target.dataset.remove;

  if (editId) {
    const record = records.find((item) => item.id === editId);
    if (record) fillForm(record);
  }

  if (removeId) {
    records = records.filter((record) => record.id !== removeId);
    write(KEY, records);
    render();
  }
});

document.getElementById("checkIn").value = today();
render();
