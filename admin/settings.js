if (localStorage.getItem("umma_user_role") !== "admin") {
  window.location.href = "../auth/login.html?portal=admin";
}

const KEY = "umma_system_settings";
const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw
      ? JSON.parse(raw)
      : {
          academicYear: "2026/2027",
          semester: "Semester 1",
          passMark: 40,
          regOpenDate: new Date().toISOString().slice(0, 10),
          regCloseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().slice(0, 10),
          regEnabled: true,
          registrarEmail: "registrar@alsuhaim.edu",
          financeEmail: "finance@alsuhaim.edu",
          updated: new Date().toISOString().slice(0, 10),
        };
  } catch {
    return {
      academicYear: "2026/2027",
      semester: "Semester 1",
      passMark: 40,
      regOpenDate: new Date().toISOString().slice(0, 10),
      regCloseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().slice(0, 10),
      regEnabled: true,
      registrarEmail: "registrar@alsuhaim.edu",
      financeEmail: "finance@alsuhaim.edu",
      updated: new Date().toISOString().slice(0, 10),
    };
  }
};

const write = (value) => localStorage.setItem(KEY, JSON.stringify(value));
let settings = read();
write(settings);

const bindForm = () => {
  document.getElementById("academicYear").value = settings.academicYear || "";
  document.getElementById("semester").value = settings.semester || "Semester 1";
  document.getElementById("passMarkInput").value = settings.passMark ?? 40;
  document.getElementById("regOpenInput").value = settings.regOpenDate || "";
  document.getElementById("regCloseInput").value = settings.regCloseDate || "";
  document.getElementById("regEnabledInput").value = String(settings.regEnabled ?? true);
  document.getElementById("registrarEmail").value = settings.registrarEmail || "";
  document.getElementById("financeEmail").value = settings.financeEmail || "";
};

const render = () => {
  document.getElementById("currentYear").textContent = settings.academicYear || "-";
  document.getElementById("currentSemester").textContent = settings.semester || "-";
  document.getElementById("passMark").textContent = String(settings.passMark ?? "-");
  document.getElementById("regOpenDate").textContent = settings.regOpenDate || "-";
  document.getElementById("regCloseDate").textContent = settings.regCloseDate || "-";
  document.getElementById("regStatus").textContent = settings.regEnabled ? "Enabled" : "Disabled";

  const rows = [
    ["Academic Year", settings.academicYear],
    ["Semester", settings.semester],
    ["Pass Mark", settings.passMark],
    ["Registration Open", settings.regOpenDate],
    ["Registration Close", settings.regCloseDate],
    ["Student Registration", settings.regEnabled ? "Enabled" : "Disabled"],
    ["Registrar Email", settings.registrarEmail],
    ["Finance Email", settings.financeEmail],
    ["Updated", settings.updated],
  ];

  const tbody = document.getElementById("dataRows");
  tbody.innerHTML = rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join("");
};

bindForm();
render();

document.getElementById("settingsForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  settings = {
    academicYear: document.getElementById("academicYear").value.trim(),
    semester: document.getElementById("semester").value,
    passMark: Number(document.getElementById("passMarkInput").value),
    regOpenDate: document.getElementById("regOpenInput").value,
    regCloseDate: document.getElementById("regCloseInput").value,
    regEnabled: document.getElementById("regEnabledInput").value === "true",
    registrarEmail: document.getElementById("registrarEmail").value.trim().toLowerCase(),
    financeEmail: document.getElementById("financeEmail").value.trim().toLowerCase(),
    updated: new Date().toISOString().slice(0, 10),
  };
  write(settings);
  render();
});
