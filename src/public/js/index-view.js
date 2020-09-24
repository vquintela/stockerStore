window.onload = () => {
    const message = document.getElementById('message-success');
    if(message) {
        setTimeout(() => {
            message.remove();
        }, 2000)
    }
}

//ANIMACION BTN SIDEBAR
const btnSidebar = document.getElementById('btn-sidebar');
if (btnSidebar) btnSidebar.addEventListener('click', () => {
  document.querySelector('.sidebar-index').classList.toggle('show-sidebar');
})

// Dropdown sidebar
document.querySelectorAll('.productos-menu').forEach(btn => {
    btn.addEventListener('click', e => {
        e.target.nextElementSibling.firstChild.nextElementSibling.classList.toggle('menu-show')
    });
});