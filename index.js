const params = new URLSearchParams(window.location.search);
const portal = params.get('portal');

if (portal && ['lecturer', 'admin', 'student'].includes(portal)) {
  localStorage.setItem('umma_selected_portal', portal);
}
