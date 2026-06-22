const ALLOC_KEY = "umma_lecturer_unit_allocations";

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

if (localStorage.getItem("umma_user_role") !== "lecturer") {
  window.location.href = "../auth/login.html?portal=lecturer";
}

const profile = (() => {
  try {
    return JSON.parse(localStorage.getItem("umma_lecturer_profile") || "{}");
  } catch {
    return {};
  }
})();

const allocations = read(ALLOC_KEY).filter((a) => a.staffNo === profile.staffNo);
const tbody = document.getElementById("dataRows");

tbody.innerHTML = allocations.length
  ? allocations
      .map(
        (a) => `<tr>
      <td>${a.day}</td>
      <td>${a.time}</td>
      <td>${a.unitCode} - ${a.unitName}</td>
      <td>${a.venue}</td>
    </tr>`
      )
      .join("")
  : "<tr><td colspan='4'>No timetable entries. Register units from My Classes.</td></tr>";
