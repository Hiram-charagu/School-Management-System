const data = window.StudentPortalData;
const student = data.getCurrentStudent();
const profile = data.getProfile();
const studentId = student?.id || "STU-001";
const studentName = student?.name || profile.name || "Student Name";

const moneyDate = () => new Date().toISOString().slice(0, 10);
let records = data.getAccommodationRecords();

const findMine = () => records.find((record) => record.studentId === studentId) || null;

const setNotice = (message, isSuccess = false) => {
  const notice = document.getElementById("accommodationNotice");
  if (!notice) return;
  notice.textContent = message;
  notice.classList.toggle("success", isSuccess);
};

const statusChip = (status) => `<span class='status-chip'>${status || "Pending"}</span>`;

const render = () => {
  const mine = findMine();
  document.getElementById("hostelCard").textContent = mine?.hostel || "Not Assigned";
  document.getElementById("roomCard").textContent = mine?.room ? `${mine.room} / ${mine.bed || "-"}` : "Pending";
  document.getElementById("statusCard").textContent = mine?.status || "No Request";

  const rows = document.getElementById("accommodationRows");
  if (!rows) return;

  rows.innerHTML = mine
    ? `<tr>
        <td>${mine.hostel || "-"}</td>
        <td>${mine.room || "Pending"}</td>
        <td>${mine.bed || "-"}</td>
        <td>${mine.package || "-"}</td>
        <td>${statusChip(mine.status)}</td>
        <td>${mine.checkIn || "-"}</td>
        <td>${mine.updated || "-"}</td>
      </tr>`
    : "<tr><td colspan='7'>No accommodation request has been submitted yet.</td></tr>";
};

const saveRecords = () => {
  data.saveAccommodationRecords(records);
  render();
};

document.getElementById("accommodationForm")?.addEventListener("submit", (event) => {
  event.preventDefault();

  const payload = {
    id: findMine()?.id || `ACC-${Date.now()}`,
    studentId,
    studentName,
    hostel: document.getElementById("hostelPreference").value,
    room: findMine()?.room || "",
    bed: findMine()?.bed || "",
    package: document.getElementById("packagePreference").value,
    status: findMine()?.status === "Approved" ? "Change Requested" : "Pending",
    checkIn: document.getElementById("checkInDate").value,
    notes: document.getElementById("notes").value.trim(),
    updated: moneyDate(),
  };

  const index = records.findIndex((record) => record.studentId === studentId);
  if (index >= 0) records[index] = { ...records[index], ...payload };
  else records.push(payload);

  saveRecords();
  setNotice("Accommodation request saved.", true);
});

document.getElementById("cancelRequest")?.addEventListener("click", () => {
  const mine = findMine();
  if (!mine) {
    setNotice("There is no accommodation request to cancel.");
    return;
  }

  if (mine.status === "Approved") {
    records = records.map((record) =>
      record.studentId === studentId ? { ...record, status: "Cancellation Requested", updated: moneyDate() } : record
    );
  } else {
    records = records.filter((record) => record.studentId !== studentId);
  }

  saveRecords();
  setNotice("Accommodation request updated.", true);
});

const today = moneyDate();
const checkIn = document.getElementById("checkInDate");
if (checkIn && !checkIn.value) checkIn.value = today;

const existing = findMine();
if (existing) {
  document.getElementById("hostelPreference").value = existing.hostel || "Jasmine Hall";
  document.getElementById("packagePreference").value = existing.package || "Boarding - Standard";
  if (existing.checkIn) document.getElementById("checkInDate").value = existing.checkIn;
  document.getElementById("notes").value = existing.notes || "";
}

render();
