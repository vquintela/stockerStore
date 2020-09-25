//ANIMACION BTN SIDEBAR
const btnSidebar = document.getElementById('btn-sidebar');
if (btnSidebar) btnSidebar.addEventListener('click', () => {
  document.querySelector('.sidebar-index').classList.toggle('show-sidebar');
});