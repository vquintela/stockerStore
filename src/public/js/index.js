// MODAL
const modal = (titulo, texto) => {
    let mascara = document.getElementById('lamascara');
    mascara.style.display = "block";
    document.querySelector('body').style.overflowY = 'hidden';
    document.getElementById('titulo-modal').innerText = titulo;
    document.querySelector('#panelResultados').innerText = texto;
    return new Promise((resolve, reject) => {
        const btnCerrar = document.getElementById('cerrarModal');
        btnCerrar.addEventListener("click", () => {
            document.getElementById('lamascara').style.display = "none";
            document.querySelector('body').style.overflowY = 'visible';
            resolve(false);
        });
        const btnAceptar = document.getElementById('aceptarModal');
        btnAceptar.addEventListener("click", () => {
            document.getElementById('lamascara').style.display = "none";
            document.querySelector('body').style.overflowY = 'visible';
            resolve(true);
        });
    });
}
    
// Dropdown sidebar
document.querySelectorAll('.productos-menu').forEach(btn => {
    btn.addEventListener('click', e => {
        e.target.nextElementSibling.firstChild.nextElementSibling.classList.toggle('menu-show')
    });
});

// SACA EL MENSAJE DE REQ FLASH
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
});

// CANTIDAD DE PRODUCTOS EN VISTA DE PRODUCTO
const btnProd = document.querySelector('.boton-agregar-producto');
if(btnProd) btnProd.addEventListener('click', e => {
    const id = e.target.getAttribute('data-id');
    const inputCantidad = document.querySelector('.cantidad-productos');
    const maxCant = parseInt(inputCantidad.getAttribute('max'));
    const cantidad = parseInt(inputCantidad.value);
    console.log(cantidad)
    if(cantidad > 0 && cantidad < maxCant) {
        location.href = `/carrito/agregar/${id}/${cantidad}`;
    } else {
        document.querySelector('.error-cantidad').innerText = `La cantidad tiene que ser mayor a cero y menor a ${maxCant}`;
    }
});