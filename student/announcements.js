const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const announcements = read('umma_announcements', []);
const studentAnnouncements = announcements.filter((a) => a.audience === 'all' || a.audience === 'students');

const list = document.getElementById('announcementsList');
if (list) {
  list.innerHTML = studentAnnouncements.length
    ? studentAnnouncements
        .slice()
        .reverse()
        .map(
          (item) => `
      <article class='list-card'>
        <h4>${item.title}</h4>
        <p class='list-meta'>${item.audience} | ${item.updated}</p>
        <p>${item.body}</p>
      </article>`
        )
        .join('')
    : "<article class='list-card'><p>No announcements available at this time.</p></article>";
}
