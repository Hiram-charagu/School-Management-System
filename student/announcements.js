const announcements = [
  {
    title: 'Semester 2 CAT Timetable Released',
    category: 'Examination Notice',
    date: '2026-02-28',
    message: 'The CAT timetable is now available on notice boards and department offices. Confirm your exam rooms early.'
  },
  {
    title: 'Library Extended Hours',
    category: 'Academic Support',
    date: '2026-02-26',
    message: 'The university library will remain open until 10:00 PM on weekdays until end of semester.'
  },
  {
    title: 'Fees Clearance Reminder',
    category: 'Finance',
    date: '2026-02-24',
    message: 'Students must clear at least 80% of fee balance before final examination cards are issued.'
  }
];

const list = document.getElementById('announcementsList');
if (list) {
  list.innerHTML = announcements
    .map(
      (item) => `
      <article class='list-card'>
        <h4>${item.title}</h4>
        <p class='list-meta'>${item.category} | ${item.date}</p>
        <p>${item.message}</p>
      </article>`
    )
    .join('');
}
