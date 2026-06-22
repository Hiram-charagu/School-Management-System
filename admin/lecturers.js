if (localStorage.getItem("umma_user_role") !== "admin") {
  window.location.href = "../auth/login.html?portal=admin";
}

const DIRECTORY_KEY = "umma_lecturer_directory";

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let directory = read(DIRECTORY_KEY);
const accounts = read("umma_accounts").filter((a) => a.role === "lecturer");

// Sync auto-created lecturer accounts into directory
accounts.forEach((a) => {
  if (!directory.some((d) => d.staffNo === a.staffNo)) {
    directory.push({
      fullName: a.fullName || "Lecturer",
      staffNo: a.staffNo || "-",
      faculty: a.faculty || "-",
      email: a.email || "-",
      status: "Active",
      updated: new Date().toISOString().slice(0, 10),
    });
  }
});
write(DIRECTORY_KEY, directory);

const render = () => {
  const tbody = document.getElementById("dataRows");
  tbody.innerHTML = directory.length
    ? directory
        .map(
          (l, i) =>
            `<tr>
              <td>LEC-${String(i + 1).padStart(3, "0")}</td>
              <td>${l.fullName}</td>
              <td>${l.staffNo}</td>
              <td>${l.faculty}</td>
              <td>${l.email}</td>
              <td><span class='badge'>${l.status}</span></td>
              <td><button class='link-btn' data-remove='${l.staffNo}'>Delete</button></td>
            </tr>`
        )
        .join("")
    : "<tr><td colspan='7'>No lecturers in directory yet.</td></tr>";

  document.getElementById("totalLecturers").textContent = String(directory.length);
  document.getElementById("activeLecturers").textContent = String(directory.filter((d) => d.status === "Active").length);
  document.getElementById("facultyCount").textContent = String(new Set(directory.map((d) => d.faculty)).size);
};

render();

document.getElementById("lecturerForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const payload = {
    fullName: document.getElementById("fullName").value.trim(),
    staffNo: document.getElementById("staffNo").value.trim().toUpperCase(),
    faculty: document.getElementById("faculty").value,
    email: document.getElementById("email").value.trim().toLowerCase(),
    status: document.getElementById("status").value,
    updated: new Date().toISOString().slice(0, 10),
  };

  if (!payload.fullName || !payload.staffNo || !payload.email) return;
  const idx = directory.findIndex((d) => d.staffNo === payload.staffNo);
  if (idx >= 0) directory[idx] = payload;
  else directory.push(payload);

  write(DIRECTORY_KEY, directory);
  render();
  e.target.reset();
});

document.getElementById("dataRows")?.addEventListener("click", (e) => {
  const staffNo = e.target.dataset.remove;
  if (!staffNo) return;
  directory = directory.filter((d) => d.staffNo !== staffNo);
  write(DIRECTORY_KEY, directory);
  render();
});
