document.getElementById('filtro-orden').addEventListener('change', () => filtrar());
const sub = document.getElementById('filtro-subCat');
if (sub) sub.addEventListener('change', () => filtrar());

const filtrar = () => {
    location.href = `/todos/1`;
}