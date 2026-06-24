const form = document.getElementById("loginForm");
const errorEl = document.getElementById("error");
const portalTitle = document.getElementById("portalTitle");
const registerLink = document.getElementById("registerLink");
const credentialLabel = document.getElementById("credentialLabel");
const credentialInput = document.getElementById("credential");

const labels = {
  admin: "Admin Portal",
  lecturer: "Lecturer/Staff Portal",
  student: "Student Portal",
};

const routes = {
  admin: "../admin/dashboard.html",
  lecturer: "../lecturer/dashboard.html",
  student: "../student/dashboard.html",
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

const readAccounts = () => {
  try {
    const raw = localStorage.getItem("umma_accounts");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAccounts = (accounts) => localStorage.setItem("umma_accounts", JSON.stringify(accounts));

const getFacultyFromStaffNo = (staffNo) => {
  const code = String(staffNo || "").toUpperCase();
  return Object.entries(facultyByPrefix).find(([prefix]) => code.startsWith(prefix)) || null;
};

const purgeRemovedParentData = () => {
  const accounts = readAccounts();
  const cleaned = accounts.filter((a) => a.role !== "parent");
  if (cleaned.length !== accounts.length) writeAccounts(cleaned);
  localStorage.removeItem("umma_parents");
  if (localStorage.getItem("umma_selected_portal") === "parent") {
    localStorage.setItem("umma_selected_portal", "student");
  }
};

purgeRemovedParentData();

if (labels[selectedPortal]) {
  portalTitle.textContent = labels[selectedPortal];
  registerLink.href = `./register.html?portal=${selectedPortal}`;
  localStorage.setItem("umma_selected_portal", selectedPortal);
}

if (selectedPortal === "lecturer") {
  credentialLabel.textContent = "Staff Portal Number";
  credentialInput.placeholder = "e.g. EDE001-2026-01";
} else {
  credentialLabel.textContent = "Email / Username";
  credentialInput.placeholder = "Enter email";
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  errorEl.textContent = "";

  const credential = credentialInput.value.trim();
  const password = document.getElementById("password").value;
  const accounts = readAccounts();

  if (!credential || !password) {
    errorEl.textContent = "Please provide login credentials.";
    return;
  }

  // Lecturer login flow: staff number + any password (for now)
  if (selectedPortal === "lecturer") {
    const staffNo = credential.toUpperCase();
    const facultyMatch = getFacultyFromStaffNo(staffNo);
    if (!facultyMatch) {
      errorEl.textContent = "Invalid staff number prefix. Use EDE001, BBT001, or SHL003.";
      return;
    }

    let lecturerAccount = accounts.find((a) => a.role === "lecturer" && a.staffNo === staffNo);
    if (!lecturerAccount) {
      lecturerAccount = {
        role: "lecturer",
        fullName: `Lecturer ${staffNo}`,
        staffNo,
        facultyCode: facultyMatch[0],
        faculty: facultyMatch[1],
        email: `${staffNo.toLowerCase()}@alsuhaim.edu`,
        password,
      };
      accounts.push(lecturerAccount);
      writeAccounts(accounts);
    }

    localStorage.setItem("umma_user_role", "lecturer");
    localStorage.setItem("umma_user_name", lecturerAccount.email);
    localStorage.setItem(
      "umma_lecturer_profile",
      JSON.stringify({
        fullName: lecturerAccount.fullName,
        staffNo: lecturerAccount.staffNo,
        facultyCode: lecturerAccount.facultyCode,
        faculty: lecturerAccount.faculty,
        email: lecturerAccount.email,
      })
    );
    window.location.href = routes.lecturer;
    return;
  }

  // Standard portal login flow
  const account = accounts.find(
    (u) => u.role === selectedPortal && u.email?.toLowerCase() === credential.toLowerCase() && u.password === password
  );

  if (!account) {
    errorEl.textContent = "Invalid username or password.";
    return;
  }

  localStorage.setItem("umma_user_role", account.role);
  localStorage.setItem("umma_user_name", account.email);
  window.location.href = routes[account.role];
});

// Password visibility toggle
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle eye icon
    const eyeIcon = togglePassword.querySelector('.eye-icon');
    if (eyeIcon) {
      eyeIcon.innerHTML = type === 'password' ? '&#128065;' : '&#128584;';
    }
  });
}
