const UNIT_KEY = "umma_admin_units_offered";
const ALLOC_KEY = "umma_lecturer_unit_allocations";

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const role = localStorage.getItem("umma_user_role");
if (role !== "lecturer") window.location.href = "../auth/login.html?portal=lecturer";

const profile = (() => {
  try {
    return JSON.parse(localStorage.getItem("umma_lecturer_profile") || "{}");
  } catch {
    return {};
  }
})();

const staffNo = profile.staffNo || "";
const facultyCode = profile.facultyCode || "";
const lecturerName = profile.fullName || "Lecturer";

document.getElementById("lecturerName").textContent = lecturerName;
document.getElementById("lecturerFaculty").textContent = facultyCode || "Faculty not set";

const allUnits = read(UNIT_KEY).filter((u) => u.offered);
const facultyUnits = allUnits.filter((u) => u.facultyCode === facultyCode);
const select = document.getElementById("unitCode");
select.innerHTML = facultyUnits.length
  ? facultyUnits.map((u) => `<option value='${u.code}'>${u.code} - ${u.name}</option>`).join("")
  : "<option value=''>No offered units for your faculty</option>";

let allocations = read(ALLOC_KEY);
const myAllocations = () => allocations.filter((a) => a.staffNo === staffNo);

document.getElementById("availableUnits").textContent = String(facultyUnits.length);

const render = () => {
  const mine = myAllocations();
  document.getElementById("totalAllocated").textContent = String(mine.length);
  const tbody = document.getElementById("dataRows");
  tbody.innerHTML = mine.length
    ? mine
        .map(
          (a) => `<tr>
          <td>${a.unitCode}</td>
          <td>${a.unitName}</td>
          <td>${a.day}</td>
          <td>${a.time}</td>
          <td>${a.venue}</td>
          <td><button class='link-btn' data-remove='${a.unitCode}'>Remove</button></td>
        </tr>`
        )
        .join("")
    : "<tr><td colspan='6'>No allocated units yet.</td></tr>";
};

render();

document.getElementById("allocateForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const code = document.getElementById("unitCode").value;
  if (!code) return;
  const unit = facultyUnits.find((u) => u.code === code);
  if (!unit) return;
  if (allocations.some((a) => a.staffNo === staffNo && a.unitCode === code)) return;

  allocations.push({
    staffNo,
    lecturerName,
    lecturerEmail: localStorage.getItem("umma_user_name") || "",
    facultyCode,
    unitCode: unit.code,
    unitName: unit.name,
    day: unit.day,
    time: unit.time,
    venue: unit.venue,
    updated: new Date().toISOString().slice(0, 10),
  });

  write(ALLOC_KEY, allocations);
  render();
});

document.getElementById("dataRows")?.addEventListener("click", (e) => {
  const code = e.target.dataset.remove;
  if (!code) return;
  allocations = allocations.filter((a) => !(a.staffNo === staffNo && a.unitCode === code));
  write(ALLOC_KEY, allocations);
  render();
});
