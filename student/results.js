const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const role = localStorage.getItem("umma_user_role");
if (role !== "student") {
  window.location.href = "../auth/login.html?portal=student";
}

const userEmail = (localStorage.getItem("umma_user_name") || "").toLowerCase();
const students = read("umma_students");
let me = students.find((s) => (s.email || "").toLowerCase() === userEmail);
if (!me) me = students[0];

const grades = read("umma_grades").filter((g) => g.studentId === me?.id);
const unitCode = (record) => record.unitCode || record.unit || "-";
const unitName = (record) => record.unitName || record.name || unitCode(record);

const tbody = document.getElementById("dataRows");
tbody.innerHTML = grades.length
  ? grades
      .map(
        (r) => `
    <tr>
      <td>${unitCode(r)}</td>
      <td>${unitName(r)}</td>
      <td>${r.grade}</td>
      <td><span class='status-chip'>${Number(r.score) >= 40 ? "Passed" : "Fail"}</span></td>
    </tr>`
      )
      .join("")
  : "<tr><td colspan='4'>No transcript data yet.</td></tr>";

document.getElementById("downloadTranscript")?.addEventListener("click", () => {
  const rowHtml = grades.length
    ? grades
        .map((g) => `<tr><td>${unitCode(g)}</td><td>${g.score}</td><td>${g.grade}</td><td>${g.updated}</td></tr>`)
        .join("")
    : "<tr><td colspan='4'>No grades available.</td></tr>";

  const html = `
  <html>
    <head>
      <title>Transcript</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1,h2 { margin: 0 0 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th,td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      </style>
    </head>
    <body>
      <h1>AL Suhaim University</h1>
      <h2>Student Transcript</h2>
      <p>Student: ${me?.name || "N/A"} (${me?.id || "N/A"})</p>
      <table>
        <thead><tr><th>Unit</th><th>Score</th><th>Grade</th><th>Date</th></tr></thead>
        <tbody>${rowHtml}</tbody>
      </table>
      <script>window.onload = function(){ window.print(); }</script>
    </body>
  </html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
});
