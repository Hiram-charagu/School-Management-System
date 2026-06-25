const profile = window.StudentPortalData.getProfile();
const registeredCodes = window.StudentPortalData.getRegisteredUnitCodes();
const offeredUnits = window.StudentPortalData.getOfferedUnits();

const userEmail = (localStorage.getItem("umma_user_name") || "").toLowerCase();
const students = window.StudentPortalData.read("umma_students", []);
const me = students.find((s) => (s.email || "").toLowerCase() === userEmail) || students[0];
const myStudentId = me?.id || "STU-001";

const attendanceRecords = window.StudentPortalData.getAttendanceRecords().filter((r) => r.studentId === myStudentId);
const accommodation = window.StudentPortalData.getMyAccommodation();
const normalizeCode = (value) => String(value || '').replace(/\s+/g, '').toUpperCase();

const presentCount = attendanceRecords.filter((r) => r.status === 'Present').length;
const attendanceRate = attendanceRecords.length ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;

const cardEls = document.querySelectorAll('.cards .card p');
if (cardEls[0]) cardEls[0].textContent = `${registeredCodes.length} unit(s) registered.`;
if (cardEls[1]) cardEls[1].textContent = `${profile.program} | ${profile.year}`;
if (cardEls[2]) cardEls[2].textContent = `${attendanceRate}% from lecturer marks.`;
if (cardEls[3]) cardEls[3].textContent = accommodation
  ? `${accommodation.status}: ${accommodation.hostel || 'Hostel'} ${accommodation.room || ''}`.trim()
  : 'No accommodation request yet.';

const rows = offeredUnits.filter((u) => registeredCodes.includes(u.code)).map((u) => {
  const unitRecords = attendanceRecords.filter((r) => normalizeCode(r.unitCode) === normalizeCode(u.code));
  const unitPresent = unitRecords.filter((r) => r.status === 'Present').length;
  const rate = unitRecords.length ? `${Math.round((unitPresent / unitRecords.length) * 100)}%` : 'N/A';
  return { code: u.code, name: u.name, status: unitRecords.length ? `${unitPresent}/${unitRecords.length} Present` : 'No Records', updated: rate };
});

const tbody = document.getElementById('dataRows');
if (tbody) {
  tbody.innerHTML = rows.length
    ? rows.map((r) => `<tr><td>${r.code}</td><td>${r.name}</td><td>${r.status}</td><td>${r.updated}</td></tr>`).join('')
    : "<tr><td colspan='4'>No registered units yet. Register units first.</td></tr>";
}
