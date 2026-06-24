const StudentPortalData = (() => {
  const KEYS = {
    profile: 'umma_student_profile',
    offeredUnits: 'umma_admin_units_offered',
    registeredUnits: 'umma_student_registered_units',
    studentTimetable: 'umma_student_timetable',
    lecturerAttendance: 'umma_lecturer_attendance_records',
    settings: 'umma_system_settings'
  };

  const defaultProfile = {
    name: 'Student Name',
    registrationNo: 'SIT/00/0000',
    program: 'BScS',
    year: 'Year 1 - Semester 1',
    faculty: 'Faculty of Computing and Informatics',
    email: localStorage.getItem('umma_user_name') || 'student@alsuhaim.edu',
    phone: '+254 700 000 000',
    gender: 'Prefer not to say',
    dob: '',
    admissionDate: '',
    sponsor: 'Self Sponsored',
    bio: '',
    photo: ''
  };

  const defaultUnits = [
    { code: 'BSCS 2201', name: 'Software Engineering', credits: 3, day: 'Monday', time: '08:00 - 10:00', venue: 'Lab 2', lecturer: 'Mr. Ahmed', offered: true },
    { code: 'BSCS 2202', name: 'Data Structures and Algorithms', credits: 3, day: 'Tuesday', time: '10:00 - 12:00', venue: 'B1-03', lecturer: 'Ms. Fatuma', offered: true },
    { code: 'BSCS 2203', name: 'Operating Systems', credits: 3, day: 'Wednesday', time: '14:00 - 16:00', venue: 'C2-01', lecturer: 'Dr. Njoroge', offered: true }
  ];

  const read = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

  const getSettings = () =>
    read(KEYS.settings, {
      regOpenDate: new Date().toISOString().slice(0, 10),
      regCloseDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 21).toISOString().slice(0, 10),
      regEnabled: true,
      semester: 'Semester 1'
    });

  const getStudentKey = () => {
    const p = getProfile();
    const email = (localStorage.getItem('umma_user_name') || p.email || '').toLowerCase();
    const studentDirectory = read('umma_students', []);
    const matched = studentDirectory.find((s) => (s.email || '').toLowerCase() === email);
    if (matched?.id) return String(matched.id).toLowerCase();
    return (p.registrationNo || email || 'default').toLowerCase();
  };

  const getProfile = () => {
    const stored = read(KEYS.profile, null);
    const merged = { ...defaultProfile, ...(stored || {}) };
    if (!stored) write(KEYS.profile, merged);
    return merged;
  };

  const saveProfile = (profile) => {
    const merged = { ...defaultProfile, ...profile };
    write(KEYS.profile, merged);
    return merged;
  };

  const getOfferedUnits = () => {
    const stored = read(KEYS.offeredUnits, null);
    if (!stored || !Array.isArray(stored) || !stored.length) {
      write(KEYS.offeredUnits, defaultUnits);
      return defaultUnits;
    }
    return stored;
  };

  const saveOfferedUnits = (units) => {
    write(KEYS.offeredUnits, units);
    return units;
  };

  const getRegisteredUnitCodes = () => {
    const raw = read(KEYS.registeredUnits, {});
    if (Array.isArray(raw)) {
      const wrapped = { [getStudentKey()]: raw };
      write(KEYS.registeredUnits, wrapped);
      return raw;
    }
    return raw[getStudentKey()] || [];
  };

  const saveRegisteredUnitCodes = (codes) => {
    const raw = read(KEYS.registeredUnits, {});
    const map = Array.isArray(raw) ? { [getStudentKey()]: raw } : raw;
    map[getStudentKey()] = codes;
    write(KEYS.registeredUnits, map);
    return codes;
  };

  const buildTimetableFromCodes = (codes) => {
    const timetable = getOfferedUnits()
      .filter((unit) => unit.offered && codes.includes(unit.code))
      .map((unit) => ({ day: unit.day, time: unit.time, unit: `${unit.code} ${unit.name}`, venue: unit.venue, lecturer: unit.lecturer, code: unit.code }));
    write(KEYS.studentTimetable, timetable);
    return timetable;
  };

  const getTimetable = () => {
    const stored = read(KEYS.studentTimetable, []);
    if (stored.length) return stored;
    return buildTimetableFromCodes(getRegisteredUnitCodes());
  };

  const getAttendanceRecords = () => read(KEYS.lecturerAttendance, []);

  const getRegistrationWindowState = () => {
    const s = getSettings();
    const today = new Date().toISOString().slice(0, 10);
    const open = s.regOpenDate || today;
    const close = s.regCloseDate || today;
    const within = today >= open && today <= close;
    return {
      ...s,
      today,
      withinWindow: !!s.regEnabled && within
    };
  };

  return {
    KEYS,
    read,
    write,
    getProfile,
    saveProfile,
    getOfferedUnits,
    saveOfferedUnits,
    getRegisteredUnitCodes,
    saveRegisteredUnitCodes,
    buildTimetableFromCodes,
    getTimetable,
    getAttendanceRecords,
    getSettings,
    getRegistrationWindowState
  };
})();

window.StudentPortalData = StudentPortalData;
