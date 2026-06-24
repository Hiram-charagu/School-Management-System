const profileForm = document.getElementById('profileForm');
const photoInput = document.getElementById('photoInput');
const photoPreview = document.getElementById('profilePhotoPreview');
const noticeEl = document.getElementById('profileNotice');

let selectedPhoto = '';
const fields = ['name', 'registrationNo', 'program', 'year', 'faculty', 'email', 'phone', 'gender', 'dob', 'admissionDate', 'sponsor', 'bio'];

const fillForm = (profile) => {
  fields.forEach((field) => {
    const input = document.getElementById(field);
    if (input) input.value = profile[field] || '';
  });
  selectedPhoto = profile.photo || '';
  photoPreview.src = selectedPhoto || '../assets/al-suhaim-logo.svg';
};

const current = window.StudentPortalData.getProfile();
fillForm(current);

photoInput?.addEventListener('change', (event) => {
  const [file] = event.target.files || [];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    selectedPhoto = reader.result;
    photoPreview.src = selectedPhoto;
  };
  reader.readAsDataURL(file);
});

profileForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const profile = {};
  fields.forEach((field) => {
    const value = document.getElementById(field)?.value;
    profile[field] = typeof value === 'string' ? value.trim() : '';
  });
  profile.photo = selectedPhoto;

  const saved = window.StudentPortalData.saveProfile(profile);
  noticeEl.textContent = 'Profile saved successfully.';
  noticeEl.classList.add('success');
  window.dispatchEvent(new Event('student-profile-updated'));
});
