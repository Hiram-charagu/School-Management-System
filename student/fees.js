const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const userEmail = (localStorage.getItem("umma_user_name") || "").toLowerCase();
const students = read("umma_students", []);
const me = students.find((s) => (s.email || "").toLowerCase() === userEmail) || students[0];
const myStudentId = me?.id || "STU-001";

const feeRecords = read("umma_fees", []);
const myFees = feeRecords.filter((f) => f.studentId === myStudentId);

const totalAmount = myFees.reduce((sum, f) => sum + Number(f.amount || 0), 0);
const totalPaid = myFees.reduce((sum, f) => sum + Number(f.paid || 0), 0);
const balance = totalAmount - totalPaid;

const feeBreakdown = [
  { item: 'Tuition', sem1: 50000, sem2: 50000 },
  { item: 'Examination', sem1: 8000, sem2: 8000 },
  { item: 'Library', sem1: 5000, sem2: 5000 },
  { item: 'ICT Services', sem1: 7000, sem2: 7000 },
  { item: 'Student Activity', sem1: 5000, sem2: 5000 }
];

const payments = myFees.map((f) => ({
  receipt: f.id,
  date: f.updated,
  amount: Number(f.paid || 0),
  mode: 'Payment',
  semester: f.semester || 'N/A'
}));

const money = (value) => value.toLocaleString('en-KE');

const feeBody = document.getElementById('feeRows');
if (feeBody) {
  feeBody.innerHTML = feeBreakdown
    .map((row) => {
      const total = row.sem1 + row.sem2;
      return `
    <tr>
      <td>${row.item}</td>
      <td>${money(row.sem1)}</td>
      <td>${money(row.sem2)}</td>
      <td>${money(total)}</td>
    </tr>`;
    })
    .join('');
}

const paymentBody = document.getElementById('paymentRows');
if (paymentBody) {
  paymentBody.innerHTML = payments.length
    ? payments.map(
        (p) => `
    <tr>
      <td>${p.receipt}</td>
      <td>${p.date}</td>
      <td>${money(p.amount)}</td>
      <td>${p.semester}</td>
    </tr>`
      ).join('')
    : '<tr><td colspan="4">No payment records yet.</td></tr>';
}
