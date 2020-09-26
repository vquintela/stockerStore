document.querySelectorAll('.eliminar').forEach(btn => btn.addEventListener('click', e => eliminar(e)));
document.querySelectorAll('.estado').forEach(btn => btn.addEventListener('click', e => estado(e)));
document.querySelector('.estado-buscar').addEventListener('change', () => filtrar());

const eliminar = async (e) => {
    const id = e.target.getAttribute('data-id');
    const res = await modal('Eliminar categoría', '¿Desea eliminar esta categoría?')
    if (res) {
        const resp = await fetch(`/categorias/eliminar/${id}`, { method: 'DELETE'});
        if (resp.ok) location.href = '/categorias'
    }
}

const estado = async (e) => {
    const id = e.target.getAttribute('data-id');
    const estado = JSON.parse(e.target.getAttribute('estado-categoria'));
    const res = await modal('Cambiar Estado', '¿Desea cambiar el estado de esta categoría?')
    if (res) {
        const resp = await fetch(`/categorias/estado/${id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({estado})
        });
        if (resp.ok) location.href = '/categorias'
    }
}

const filtrar = () => {
    const estado = document.querySelector('.estado-buscar').value;
    if(estado === 'todos') {
        location.href = `/categorias`;
    } else {
        location.href = `/categorias/buscar/${estado}`;
    }
}