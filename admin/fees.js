if (localStorage.getItem("umma_user_role") !== "admin") {
  window.location.href = "../auth/login.html?portal=admin";
}

const KEY = "umma_fees";
const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let records = read(KEY);

const computeStatus = (amount, paid) => {
  if (paid <= 0) return "Unpaid";
  if (paid < amount) return "Partially Paid";
  return "Paid";
};

const render = () => {
  const tbody = document.getElementById("dataRows");
  tbody.innerHTML = records.length
    ? records
        .map((r) => {
          const balance = Math.max(0, Number(r.amount) - Number(r.paid));
          return `<tr>
            <td>${r.id}</td>
            <td>${r.studentId}</td>
            <td>${r.semester}</td>
            <td>${r.amount}</td>
            <td>${r.paid}</td>
            <td>${balance}</td>
            <td><span class='badge'>${r.status}</span></td>
            <td>${r.updated}</td>
            <td><button class='link-btn' data-remove='${r.id}'>Delete</button></td>
          </tr>`;
        })
        .join("")
    : "<tr><td colspan='10'>No fee records available.</td></tr>";

  const billed = records.reduce((a, b) => a + Number(b.amount || 0), 0);
  const collected = records.reduce((a, b) => a + Number(b.paid || 0), 0);
  const outstanding = Math.max(0, billed - collected);
  document.getElementById("totalBilled").textContent = String(billed);
  document.getElementById("totalCollected").textContent = String(collected);
  document.getElementById("totalOutstanding").textContent = String(outstanding);
};

render();

document.getElementById("feeForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const studentId = document.getElementById("studentId").value.trim().toUpperCase();
  const semester = document.getElementById("semester").value.trim().toUpperCase();
  const amount = Number(document.getElementById("amount").value);
  const paidNow = Number(document.getElementById("paidNow").value);
  if (!studentId || !semester || Number.isNaN(amount) || Number.isNaN(paidNow)) return;

  const idx = records.findIndex((r) => r.studentId === studentId && r.semester === semester);
  if (idx >= 0) {
    records[idx].amount = amount;
    records[idx].paid = Math.max(0, Number(records[idx].paid || 0) + paidNow);
    records[idx].status = computeStatus(records[idx].amount, records[idx].paid);
    records[idx].updated = new Date().toISOString().slice(0, 10);
  } else {
    const paid = Math.max(0, paidNow);
    records.push({
      id: `INV-${Date.now()}`,
      studentId,
      semester,
      amount,
      paid,
      status: computeStatus(amount, paid),
      updated: new Date().toISOString().slice(0, 10),
    });
  }

  write(KEY, records);
  render();
  e.target.reset();
  document.getElementById("paidNow").value = "0";
});

document.getElementById("dataRows")?.addEventListener("click", (e) => {
  const id = e.target.dataset.remove;
  if (!id) return;
  records = records.filter((r) => r.id !== id);
  write(KEY, records);
  render();
});
