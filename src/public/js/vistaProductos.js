document.getElementById('filtro-destacado').addEventListener('change', () => filtrar());;
document.getElementById('filtro-orden').addEventListener('change', () => filtrar());;

const filtrar = () => {
    const destacado = document.getElementById('filtro-destacado').value;
    const orden = document.getElementById('filtro-orden').value;
    const pathname = window.location.pathname;
    location.href = `${pathname}?destacado=${destacado}&orden=${orden}`;
}