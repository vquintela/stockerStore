// LOGICA BOTON VER DETALLE E INSERCION DE DATOS EN VENTANA MODAL
document.querySelectorAll('.detalle-venta').forEach(element => {
    element.addEventListener('click', async (e) => {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        const resp = await fetch(`/venta/detalle/${id}`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        }); 
        const res = JSON.parse(await resp.text());
        detalleModal(res)
    });
});

const detalleModal = (res) => {
    const panel = document.getElementById('panelResultadosModal');
    const filas = new DocumentFragment();
    res.forEach(item => {
        const fila = generarFilas(item);
        filas.appendChild(fila);
    });
    panel.innerText = '';
    panel.appendChild(filas);
    mostrarModal();
}

const generarFilas = item => {
    const tr = document.createElement('tr');
    const thNombre = document.createElement('th');
    thNombre.innerText = item.id_producto.nombre;
    const thCantidad = document.createElement('th');
    thCantidad.innerText = item.cantidad;
    const thPrecio = document.createElement('th');
    thPrecio.innerText = item.precio;
    tr.appendChild(thNombre)
    tr.appendChild(thCantidad)
    tr.appendChild(thPrecio)
    return tr;
}

const mostrarModal = () => {
    let mascara = document.getElementById('modal-detalle');
    mascara.style.display = "block";
    document.querySelector('body').style.overflowY = 'hidden';
    const btnCerrar = document.getElementById('cerrarModalDetalle');
    btnCerrar.addEventListener("click", () => {
        mascara.style.display = "none";
        document.querySelector('body').style.overflowY = 'visible';
    });
}

// FILTRO DE BUSQUEDA POR ESTADO DE LA VENTA
document.getElementById('estado-venta').addEventListener('change', e => {
    location.href = `/venta/1?estado=${e.target.value}`;
});