document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));
document.querySelector('.rol-buscar').addEventListener('change', () => filtrar());

const eliminar = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Eliminar Usuario', '¿Desea Eliminar este usuario?')
    if (res) {
        const resp = await fetch(`/users/eliminar/${id}`, { method: 'DELETE'});
        if (resp.ok) location.href = '/users'
    }
}

const filtrar = () => {
    const rol = document.querySelector('.rol-buscar').value;
    location.href = `/users?rol=${rol}`;
}