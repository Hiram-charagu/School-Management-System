const userEmail = (localStorage.getItem("umma_user_name") || "").toLowerCase();
const students = window.StudentPortalData.read("umma_students", []);
const me = students.find((s) => (s.email || "").toLowerCase() === userEmail) || students[0];
const myStudentId = me?.id || "STU-001";

const records = window.StudentPortalData
  .getAttendanceRecords()
  .filter((r) => r.studentId === myStudentId);

const totalSessions = records.length;
const attendedSessions = records.filter((r) => r.status === 'Present').length;
const absentSessions = totalSessions - attendedSessions;
const overallRate = totalSessions ? Math.round((attendedSessions / totalSessions) * 100) : 0;

const cardEls = document.querySelectorAll('.cards .card p');
if (cardEls[0]) cardEls[0].textContent = `${overallRate}%`;
if (cardEls[1]) cardEls[1].textContent = `${absentSessions} session(s) marked absent.`;
if (cardEls[2]) cardEls[2].textContent = `${attendedSessions} present marks from lecturer.`;

const tbody = document.getElementById('dataRows');
if (tbody) {
  tbody.innerHTML = records.length
    ? records
        .slice()
        .reverse()
        .map(
          (r) => `<tr><td>${r.sessionDate}</td><td>${r.unitCode}</td><td><span class='status-chip'>${r.status}</span></td><td>${r.lecturerName || 'Lecturer'}</td></tr>`
        )
        .join('')
    : "<tr><td colspan='4'>No lecturer attendance marks yet.</td></tr>";
}
