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
    
// DROPDOWN SIDEBAR
document.querySelectorAll('.productos-menu').forEach(btn => {
    btn.addEventListener('click', e => {
        e.target.nextElementSibling.firstChild.nextElementSibling.classList.toggle('menu-show')
    });
});

//ANIMACION BTN SIDEBAR
const btnSidebar = document.getElementById('btn-sidebar');
if (btnSidebar) btnSidebar.addEventListener('click', () => {
  document.querySelector('.sidebar-index').classList.toggle('show-sidebar');
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

// CANTIDAD DE PRODUCTOS EN VISTA DE PRODUCTO
const btnProd = document.querySelector('.boton-agregar-producto');
if(btnProd) btnProd.addEventListener('click', e => {
    const id = e.target.getAttribute('data-id');
    const inputCantidad = document.querySelector('.cantidad-productos');
    const maxCant = parseInt(inputCantidad.getAttribute('max'));
    const cantidad = parseInt(inputCantidad.value);
    if(cantidad > 0 && cantidad < maxCant) {
        location.href = `/carrito/agregar/${id}/${cantidad}`;
    } else {
        document.querySelector('.error-cantidad').innerText = `La cantidad tiene que ser mayor a cero y menor a ${maxCant}`;
    }
});

// CANTIDAD PRODUCTO EN VISTA CARRITO
document.querySelectorAll('.add-producto').forEach(btnAddCant => {
    const cantidadMaxima = btnAddCant.getAttribute('data-cantidad');
    const cantidad = btnAddCant.getAttribute('cantidad');
    if (parseInt(cantidad) >= parseInt(cantidadMaxima)) btnAddCant.remove();
});

// CHECKBOX METODO DE PAGO EN CARRITO
const check1 = document.getElementById('check1');
const check2 = document.getElementById('check2');
if (check1) check1.addEventListener('change', e => {
    if (e.target.checked) {
        check2.checked = null;
    }
});
if (check2) check2.addEventListener('change', e => {
    if (e.target.checked) {
        check1.checked = null;
    }
});

// FILTRO CATEGORIAS INDEX
const filtroCat = document.getElementById('filtro-categoria');
if (filtroCat) filtroCat.addEventListener('change', () => {
    location.href = `/todos/${filtroCat.value}/1`;
});