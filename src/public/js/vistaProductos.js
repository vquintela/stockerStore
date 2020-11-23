document.getElementById('filtro-destacado').addEventListener('change', () => filtrar());
document.getElementById('filtro-orden').addEventListener('change', () => filtrar());
document.getElementById('filtro-categoria').addEventListener('change', () => filtrar());
const sub = document.getElementById('filtro-subCat');
if (sub) sub.addEventListener('change', () => filtrar());

const filtrar = () => {
    const destacado = document.getElementById('filtro-destacado').value;
    const orden = document.getElementById('filtro-orden').value;
    const categoria = document.getElementById('filtro-categoria').value;
    const subCat = document.getElementById('filtro-subCat');
    let valueSubCat = '';
    if(subCat) valueSubCat = subCat.value;
    location.href = `/todos/${categoria}/1?destacado=${destacado}&orden=${orden}&subCat=${valueSubCat}`;
}