document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));
document.querySelectorAll('.estado').forEach(btn => btn.addEventListener('click', e => estado(e)));
document.querySelector('.estado-buscar').addEventListener('change', () => filtrar());

const eliminar = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Eliminar Marca', '¿Desea Eliminar esta Marca?')
    if (res) {
        const resp = await fetch(`/marcas/eliminar/${id}`, { method: 'DELETE'});
        if (resp.ok) location.href = '/marcas'
    }
}

const estado = async (e) => {
    const id = e.target.getAttribute('data-id');
    const estado = JSON.parse(e.target.getAttribute('estado-marca'));
    const res = await modal('Cambiar Estado', '¿Desea cambiar el estado de esta Marca?')
    if (res) {
        const resp = await fetch(`/marcas/estado/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({estado})
        });
        if (resp.ok) location.href = '/marcas'
    }
}

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

const filtrar = () => {
    const estado = document.querySelector('.estado-buscar').value;
    if(estado === 'todos') {
        location.href = `/marcas`;
    } else {
        location.href = `/marcas/buscar/${estado}`;
    }
}

window.onload = () => {
    const message = document.getElementById('message-success');
    if(message) {
        setTimeout(() => {
            message.remove();
        }, 2000)
    }
}


// Dropdown sidebar
document.querySelectorAll('.productos-menu').forEach(btn => {
    btn.addEventListener('click', e => {
        e.target.nextElementSibling.firstChild.nextElementSibling.classList.toggle('menu-show')
    });
});