const allUnits = window.StudentPortalData.getOfferedUnits();
const openUnits = allUnits.filter((u) => u.offered);
const selectedCodes = new Set(window.StudentPortalData.getRegisteredUnitCodes());
const regState = window.StudentPortalData.getRegistrationWindowState();

const form = document.getElementById("unitsForm");
const unitRows = document.getElementById("unitRows");
const noticeEl = document.getElementById("unitsNotice");
const registeredUnitsEl = document.getElementById("registeredUnits");
const totalCreditsEl = document.getElementById("totalCredits");
const semesterTag = document.getElementById("semesterTag");
const regWindowTag = document.getElementById("regWindowTag");
const dropBtn = document.getElementById("dropSelectedBtn");

semesterTag.textContent = regState.semester || "Semester";
regWindowTag.textContent = regState.withinWindow
  ? `Open: ${regState.regOpenDate} to ${regState.regCloseDate}`
  : `Closed: ${regState.regOpenDate} to ${regState.regCloseDate}`;

const renderSummary = () => {
  const selectedUnits = openUnits.filter((u) => selectedCodes.has(u.code));
  const credits = selectedUnits.reduce((sum, u) => sum + Number(u.credits || 0), 0);
  registeredUnitsEl.textContent = String(selectedUnits.length);
  totalCreditsEl.textContent = String(credits);
};

const renderRows = () => {
  if (!unitRows) return;
  unitRows.innerHTML = openUnits.length
    ? openUnits
        .map((u) => {
          const registered = selectedCodes.has(u.code);
          return `<tr>
            <td><input type='checkbox' name='unitCode' value='${u.code}' ${registered ? "checked" : ""} /></td>
            <td>${u.code}</td>
            <td>${u.name}</td>
            <td>${u.credits}</td>
            <td><span class='status-chip'>${registered ? "Registered" : "Open"}</span></td>
            <td>${registered ? "<span class='muted'>Use drop button</span>" : "<span class='muted'>Use register button</span>"}</td>
          </tr>`;
        })
        .join("")
    : "<tr><td colspan='6'>No units offered yet. Admin should add units first.</td></tr>";
};

const saveAndSync = () => {
  const codes = Array.from(selectedCodes);
  window.StudentPortalData.saveRegisteredUnitCodes(codes);
  window.StudentPortalData.buildTimetableFromCodes(codes);
  renderSummary();
  renderRows();
};

renderSummary();
renderRows();

if (!regState.withinWindow) {
  noticeEl.textContent = "Registration is currently closed. Contact admin if you need unit changes.";
  noticeEl.classList.add("warning");
  form?.querySelector("button[type='submit']")?.setAttribute("disabled", "disabled");
  dropBtn?.setAttribute("disabled", "disabled");
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!regState.withinWindow) return;

  const checked = form.querySelectorAll("input[name='unitCode']:checked");
  checked.forEach((cb) => selectedCodes.add(cb.value));
  saveAndSync();
  noticeEl.textContent = "Units registered and pushed to timetable successfully.";
  noticeEl.classList.add("success");
});

dropBtn?.addEventListener("click", () => {
  if (!regState.withinWindow) return;
  const checked = form.querySelectorAll("input[name='unitCode']:checked");
  checked.forEach((cb) => selectedCodes.delete(cb.value));
  saveAndSync();
  noticeEl.textContent = "Selected units dropped successfully.";
  noticeEl.classList.add("success");
});
