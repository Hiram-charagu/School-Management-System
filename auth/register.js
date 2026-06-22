const form = document.getElementById("registerForm");
const msg = document.getElementById("msg");
const portalTitle = document.getElementById("portalTitle");
const loginLink = document.getElementById("loginLink");
const identityLabel = document.getElementById("identityLabel");
const identityInput = document.getElementById("regEmail");

const labels = {
  admin: "Admin Portal",
  lecturer: "Lecturer/Staff Portal",
  student: "Student Portal",
};

const facultyByPrefix = {
  EDE001: "Education",
  BBT001: "Business and Technology",
  SHL003: "Sharia and Law",
};

const params = new URLSearchParams(window.location.search);
let selectedPortal = params.get("portal");
if (!selectedPortal || !labels[selectedPortal]) {
  selectedPortal = localStorage.getItem("umma_selected_portal") || "student";
}

if (labels[selectedPortal]) {
  portalTitle.textContent = labels[selectedPortal];
  loginLink.href = `./login.html?portal=${selectedPortal}`;
  localStorage.setItem("umma_selected_portal", selectedPortal);
}

if (selectedPortal === "lecturer") {
  identityLabel.textContent = "Staff Portal Number";
  identityInput.placeholder = "e.g. EDE001-2026-01";
} else {
  identityLabel.textContent = "Email";
  identityInput.type = "email";
}

const readAccounts = () => {
  try {
    const raw = localStorage.getItem("umma_accounts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAccounts = (accounts) => localStorage.setItem("umma_accounts", JSON.stringify(accounts));

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fullName = document.getElementById("fullName").value.trim();
  const identity = identityInput.value.trim();
  const password = document.getElementById("regPassword").value;

  if (!fullName || !identity || !password) {
    msg.textContent = "Please fill all required fields.";
    return;
  }

  const accounts = readAccounts();

  if (selectedPortal === "lecturer") {
    const staffNo = identity.toUpperCase();
    const facultyEntry = Object.entries(facultyByPrefix).find(([prefix]) => staffNo.startsWith(prefix));
    if (!facultyEntry) {
      msg.textContent = "Use lecturer staff prefix EDE001, BBT001, or SHL003.";
      return;
    }

    if (accounts.some((a) => a.role === "lecturer" && a.staffNo === staffNo)) {
      msg.textContent = "Staff number already registered. Please login.";
      return;
    }

    accounts.push({
      role: "lecturer",
      fullName,
      staffNo,
      facultyCode: facultyEntry[0],
      faculty: facultyEntry[1],
      email: `${staffNo.toLowerCase()}@umma.edu`,
      password,
    });

    writeAccounts(accounts);
    msg.textContent = "Lecturer account created. Proceed to login.";
    form.reset();
    return;
  }

  const email = identity.toLowerCase();
  if (accounts.some((a) => a.role === selectedPortal && a.email?.toLowerCase() === email)) {
    msg.textContent = "This email is already registered. Please login.";
    return;
  }

  accounts.push({
    fullName,
    email,
    password,
    role: selectedPortal,
  });

  writeAccounts(accounts);
  msg.textContent = `${labels[selectedPortal]} account created. Proceed to login.`;
  form.reset();
});
