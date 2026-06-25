if (localStorage.getItem("umma_user_role") !== "admin") {
  window.location.href = "../auth/login.html?portal=admin";
}

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const stats = [
  { id: "Students", name: String(read("umma_students").length), status: "Total", updated: new Date().toISOString().slice(0, 10) },
  { id: "Lecturers", name: String(read("umma_accounts").filter((a) => a.role === "lecturer").length), status: "Total", updated: new Date().toISOString().slice(0, 10) },
  { id: "Open Units", name: String(read("umma_admin_units_offered").filter((u) => u.offered).length), status: "Active", updated: new Date().toISOString().slice(0, 10) },
  { id: "Accommodation", name: String(read("umma_accommodation_records").length), status: "Requests", updated: new Date().toISOString().slice(0, 10) },
];

const tbody = document.getElementById("dataRows");
tbody.innerHTML = stats.map((s) => `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.status}</td><td>${s.updated}</td></tr>`).join("");
