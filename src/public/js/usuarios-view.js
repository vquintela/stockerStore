document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));
document.querySelectorAll('.estado').forEach(btn => btn.addEventListener('click', e => estado(e)));
document.querySelector('.rol-buscar').addEventListener('change', e => filtrar(e));

const eliminar = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Eliminar Usuario', '¿Desea Eliminar este usuario?')
    if (res) {
        const resp = await fetch(`/users/eliminar/${id}`, { method: 'DELETE'});
        if (resp.ok) location.href = '/users'
    }
}

const estado = async (e) => {
    const id = e.target.getAttribute('data-id');
    const estado = JSON.parse(e.target.getAttribute('estado-usuario'));
    const res = await modal('Cambiar Estado', '¿Desea cambiar el estado de este usuario?')
    if (res) {
        const resp = await fetch(`/users/estado/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({estado})
        });
        if (resp.ok) location.href = '/users'
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

const filtrar = e => {
    const rol = e.target.value;
    if (rol === 'todos') {
        location.href = '/users';
    } else {
        location.href = `/users/buscar/${rol}`;
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