const KEY = "umma_admin_units_offered";
const CLASS_KEY = "umma_classes";

const FACULTIES = {
  EDE001: { name: "Education", programs: ["BED", "BSCED", "BAED"] },
  BBT001: { name: "Business and Technology", programs: ["BSCS", "BBIT", "BCOM", "BSIT", "BBA"] },
  SHL003: { name: "Sharia and Law", programs: ["SHL", "LLB", "ISL"] },
};

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

let units = read();
const save = () => {
  localStorage.setItem(KEY, JSON.stringify(units));
  localStorage.setItem(CLASS_KEY, JSON.stringify(units));
};

const facultyEl = document.getElementById("faculty");
const programEl = document.getElementById("program");
const customProgramEl = document.getElementById("customProgram");

const bindPrograms = () => {
  const selected = FACULTIES[facultyEl.value];
  const programs = [...(selected?.programs || []), "OTHER"];
  programEl.innerHTML = programs.map((p) => `<option value='${p}'>${p}</option>`).join("");
  customProgramEl.style.display = "none";
  customProgramEl.value = "";
};

facultyEl.addEventListener("change", bindPrograms);
programEl.addEventListener("change", () => {
  customProgramEl.style.display = programEl.value === "OTHER" ? "block" : "none";
});
bindPrograms();

const renderSummary = () => {
  document.getElementById("totalUnits").textContent = String(units.length);
  document.getElementById("openUnits").textContent = String(units.filter((u) => u.offered).length);
};

const renderRows = () => {
  const tbody = document.getElementById("unitRows");
  if (!tbody) return;
  tbody.innerHTML = units.length
    ? units
        .map(
          (u) =>
            `<tr>
              <td>${FACULTIES[u.facultyCode]?.name || u.facultyCode}</td>
              <td>${u.programCode || "-"}</td>
              <td>${u.code}</td>
              <td>${u.name}</td>
              <td>${u.credits}</td>
              <td>${u.lecturer}</td>
              <td>${u.day}</td>
              <td>${u.time}</td>
              <td>${u.venue}</td>
              <td><span class='badge'>${u.offered ? "Open" : "Not Offered"}</span></td>
              <td>
                <button class='link-btn' data-action='toggle' data-code='${u.code}'>Toggle</button>
                <button class='link-btn' data-action='delete' data-code='${u.code}'>Delete</button>
              </td>
            </tr>`
        )
        .join("")
    : "<tr><td colspan='11'>No units configured.</td></tr>";
};

const renderAll = () => {
  renderSummary();
  renderRows();
};

renderAll();

document.getElementById("unitForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const facultyCode = facultyEl.value;
  const programCode = programEl.value === "OTHER" ? customProgramEl.value.trim().toUpperCase() : programEl.value;
  const payload = {
    facultyCode,
    programCode,
    code: document.getElementById("code").value.trim().toUpperCase().replace(/\s+/g, ""),
    name: document.getElementById("name").value.trim(),
    credits: Number(document.getElementById("credits").value),
    lecturer: document.getElementById("lecturer").value.trim(),
    day: document.getElementById("day").value.trim(),
    time: document.getElementById("time").value.trim(),
    venue: document.getElementById("venue").value.trim(),
    offered: document.getElementById("offered").value === "true",
    updated: new Date().toISOString().slice(0, 10),
  };

  if (!programCode) {
    alert("Enter a custom program code when selecting OTHER.");
    return;
  }

  if (!payload.code.startsWith(programCode)) {
    alert(`Unit code must start with selected program code (${programCode}). Example: ${programCode}2201`);
    return;
  }

  const idx = units.findIndex((u) => u.code === payload.code);
  if (idx >= 0) units[idx] = payload;
  else units.push(payload);
  save();
  renderAll();
  event.target.reset();
  bindPrograms();
});

document.getElementById("unitRows")?.addEventListener("click", (event) => {
  const action = event.target.dataset.action;
  const code = event.target.dataset.code;
  if (!action || !code) return;
  if (action === "delete") units = units.filter((u) => u.code !== code);
  if (action === "toggle") units = units.map((u) => (u.code === code ? { ...u, offered: !u.offered } : u));
  save();
  renderAll();
});
