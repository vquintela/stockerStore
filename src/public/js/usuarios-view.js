document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));
document.querySelectorAll('.estado').forEach(btn => btn.addEventListener('click', e => estado(e)));
document.querySelector('.rol-buscar').addEventListener('change', () => filtrar());
document.querySelector('.estado-buscar').addEventListener('change', () => filtrar());

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
    const res = await modal('Cambiar Estado', '¿Desea cambiar el estado de este usuario?')
    if (res) {
        const resp = await fetch(`/users/estado/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        });
        if (resp.ok) location.href = '/users'
    }
}

const filtrar = () => {
    const rol = document.querySelector('.rol-buscar').value;
    const estado = document.querySelector('.estado-buscar').value;
    location.href = `/users?estado=${estado}&rol=${rol}`;
}