const rows = window.StudentPortalData.getTimetable();
const tbody = document.getElementById('dataRows');

if (tbody) {
  tbody.innerHTML = rows.length
    ? rows.map((r) => `<tr><td>${r.day}</td><td>${r.time}</td><td>${r.unit}</td><td>${r.venue}</td></tr>`).join('')
    : "<tr><td colspan='4'>No timetable yet. Register units to generate timetable.</td></tr>";
}
