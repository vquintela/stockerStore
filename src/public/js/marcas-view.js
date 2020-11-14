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

const filtrar = () => {
    const estado = document.querySelector('.estado-buscar').value;
    location.href = `/marcas?estado=${estado}`;
}