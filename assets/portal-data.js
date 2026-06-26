(function () {
  const KEYS = {
    students: "umma_students",
    lecturers: "umma_lecturers",
    classes: "umma_classes",
    units: "umma_admin_units_offered",
    grades: "umma_grades",
    attendance: "umma_lecturer_attendance_records",
    fees: "umma_fees",
    accommodation: "umma_accommodation_records",
    announcements: "umma_announcements",
    studentRegistrations: "umma_student_registered_units",
    lecturerAllocations: "umma_lecturer_unit_allocations",
  };

  const read = (key, fallback = []) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const today = () => new Date().toISOString().slice(0, 10);

  const calcGrade = (score) => {
    const s = Number(score);
    if (Number.isNaN(s)) return "N/A";
    if (s >= 70) return "A";
    if (s >= 60) return "B";
    if (s >= 50) return "C";
    if (s >= 40) return "D";
    return "E";
  };

  const ensureActionStyles = () => {
    if (document.getElementById("umma-shared-styles")) return;
    const style = document.createElement("style");
    style.id = "umma-shared-styles";
    style.textContent =
      ".form-wrap{margin:1rem 0;background:#fff;border-radius:12px;padding:1rem;box-shadow:0 8px 20px rgba(15,23,42,.06)}" +
      ".form-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:.6rem}" +
      ".form-grid input,.form-grid select,.form-grid textarea{padding:.6rem;border:1px solid #d1d5db;border-radius:8px}" +
      ".action-btn{background:#1e88e5;color:#fff;border:none;border-radius:8px;padding:.65rem .8rem;cursor:pointer}" +
      ".link-btn{background:transparent;border:none;color:#1e88e5;cursor:pointer;padding:0 .4rem}" +
      ".badge{padding:.12rem .45rem;border-radius:999px;background:#e0f2fe;color:#075985;font-size:.8rem}" +
      ".muted{color:#64748b}";
    document.head.appendChild(style);
  };

  const ensureSeed = () => {
    if (!read(KEYS.students).length) {
      write(KEYS.students, [
        { id: "STU-001", name: "Ayan Yusuf", className: "BSCS Y2", status: "Active", updated: today() },
        { id: "STU-002", name: "Halima Noor", className: "BBIT Y1", status: "Active", updated: today() },
      ]);
    }

    if (!read(KEYS.lecturers).length) {
      write(KEYS.lecturers, [
        { id: "LEC-001", name: "Dr. Ahmed Ali", email: "lecturer@alsuhaim.edu", status: "Active", updated: today() },
        { id: "LEC-002", name: "Ms. Fatuma Said", email: "lecturer2@alsuhaim.edu", status: "Active", updated: today() },
      ]);
    }

    const offered = read(KEYS.units);
    if (!read(KEYS.classes).length) {
      if (offered.length) {
        write(
          KEYS.classes,
          offered.map((u, i) => ({
            id: u.code || `CLS-${String(i + 1).padStart(3, "0")}`,
            name: u.name || "Unit",
            lecturer: u.lecturer || "Lecturer",
            lecturerEmail: i % 2 === 0 ? "lecturer@alsuhaim.edu" : "lecturer2@alsuhaim.edu",
            day: u.day || "Monday",
            time: u.time || "08:00 - 10:00",
            venue: u.venue || "Main Hall",
            offered: !!u.offered,
            updated: today(),
          }))
        );
      } else {
        write(KEYS.classes, [
          { id: "BSCS2201", name: "Software Engineering", lecturer: "Dr. Ahmed Ali", lecturerEmail: "lecturer@alsuhaim.edu", day: "Monday", time: "08:00 - 10:00", venue: "Lab 2", offered: true, updated: today() },
          { id: "BBIT1102", name: "Database Systems", lecturer: "Ms. Fatuma Said", lecturerEmail: "lecturer2@alsuhaim.edu", day: "Tuesday", time: "10:00 - 12:00", venue: "B1-03", offered: true, updated: today() },
        ]);
      }
    }

    if (!read(KEYS.grades).length) {
      write(KEYS.grades, [
        { id: "GRD-001", studentId: "STU-001", studentName: "Ayan Yusuf", unit: "BSCS2201", score: 78, grade: "A", lecturer: "lecturer@alsuhaim.edu", updated: today() },
      ]);
    }

    if (!read(KEYS.attendance).length) {
      write(KEYS.attendance, [
        { id: "ATT-001", studentId: "STU-001", unitCode: "BSCS2201", sessionDate: today(), status: "Present", lecturerEmail: "lecturer@alsuhaim.edu", staffNo: "EDE001-2026-01", lecturerName: "Dr. Ahmed Ali", updated: today() },
      ]);
    }

    if (!read(KEYS.fees).length) {
      write(KEYS.fees, [
        { id: "FEE-001", studentId: "STU-001", amount: 45000, paid: 30000, status: "Partially Paid", updated: today() },
        { id: "FEE-002", studentId: "STU-002", amount: 40000, paid: 40000, status: "Paid", updated: today() },
      ]);
    }

    if (!read(KEYS.accommodation).length) {
      write(KEYS.accommodation, [
        {
          id: "ACC-001",
          studentId: "STU-001",
          studentName: "Ayan Yusuf",
          hostel: "Jasmine Hall",
          room: "J-204",
          bed: "B",
          package: "Boarding - Standard",
          status: "Approved",
          checkIn: today(),
          notes: "Bring student ID during check-in.",
          updated: today(),
        },
      ]);
    }

    if (!read(KEYS.announcements).length) {
      write(KEYS.announcements, [
        { id: "ANN-001", audience: "all", title: "Semester Open", body: "Classes begin next week.", updated: today(), by: "admin@alsuhaim.edu" },
      ]);
    }

    // Seed default admin account (matches README credentials)
    const accounts = JSON.parse(localStorage.getItem("umma_accounts") || "[]");
    if (!accounts.some((a) => a.role === "admin")) {
      accounts.push({ role: "admin", fullName: "Administrator", email: "admin@umma.edu", password: "admin123" });
      localStorage.setItem("umma_accounts", JSON.stringify(accounts));
    }
    if (!accounts.some((a) => a.role === "student")) {
      accounts.push({ role: "student", fullName: "Demo Student", email: "student@umma.edu", password: "student123" });
      localStorage.setItem("umma_accounts", JSON.stringify(accounts));
    }
  };

  const getCurrentUser = () => ({
    role: localStorage.getItem("umma_user_role") || "",
    email: (localStorage.getItem("umma_user_name") || "").toLowerCase(),
  });

  const requireRole = (role) => {
    const user = getCurrentUser();
    if (user.role !== role) {
      window.location.href = `../auth/login.html?portal=${role}`;
      return false;
    }
    return true;
  };

  window.UmmaData = { KEYS, read, write, today, calcGrade, ensureActionStyles, ensureSeed, getCurrentUser, requireRole };
})();
