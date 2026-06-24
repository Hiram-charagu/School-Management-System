const renderStudentHeader = () => {
  const app = document.querySelector('.app');
  if (app && !document.querySelector('.portal-footer')) {
    const footer = document.createElement('footer');
    footer.className = 'portal-footer';
    footer.innerHTML = "<p>&copy; 2026 AL Suhaim University. All rights reserved.</p>";
    app.insertAdjacentElement('afterend', footer);
  }

  if (!document.getElementById('studentFooterStyle')) {
    const style = document.createElement('style');
    style.id = 'studentFooterStyle';
    style.textContent = ".portal-footer{margin:1rem;margin-top:.5rem;background:#0f172a;color:#e2e8f0;text-align:center;padding:.8rem;border-radius:10px}.portal-footer p{margin:0;font-size:.9rem}";
    document.head.appendChild(style);
  }

  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  const profile = window.StudentPortalData?.getProfile();
  if (!profile) return;

  const existing = document.getElementById('studentHeaderCard');
  if (existing) existing.remove();

  const headerCard = document.createElement('div');
  headerCard.id = 'studentHeaderCard';
  headerCard.className = 'topbar-user';

  const img = document.createElement('img');
  img.className = 'topbar-user-photo';
  img.src = profile.photo || '../assets/al-suhaim-logo.svg';
  img.alt = 'Student profile photo';

  const meta = document.createElement('div');
  meta.className = 'topbar-user-meta';

  const name = document.createElement('div');
  name.className = 'topbar-user-name';
  name.textContent = profile.name || 'Student Name';

  const course = document.createElement('div');
  course.className = 'topbar-user-course';
  course.textContent = `${profile.program || 'BScS'} | ${profile.registrationNo || 'SIT/00/0000'}`;

  meta.appendChild(name);
  meta.appendChild(course);
  headerCard.appendChild(img);
  headerCard.appendChild(meta);
  topbar.appendChild(headerCard);
};

window.addEventListener('DOMContentLoaded', renderStudentHeader);
window.addEventListener('student-profile-updated', renderStudentHeader);
