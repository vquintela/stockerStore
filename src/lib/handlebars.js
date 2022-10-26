const moment = require('moment');
moment.locale('es')
const helpers = {}

helpers.for = (numero, actual, categoria, destacado, orden, actualSubCat) => {
    let fragment = "";
    let element;
    if (actual == 1) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/todos/${Number(actual) - 1}">Previous</a></li>`;
    }
    fragment = fragment + element;
    for (let i = 1; i <= numero; i++) {
        if (i == actual) {
            element = `<li class="page-item disabled"><a class="page-link" href="#">${i}</a></li>`;
        } else {
            element = `<li class="page-item"><a class="page-link" href="/todos/${i}">${i}</a></li>`;
        }
        fragment = fragment + element;
    }
    if (numero == actual) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/todos/${Number(actual) + 1}">Next</a></li>`;
    }
    fragment = fragment + element;
    return fragment;
}

helpers.indexProd = (numero, actual, actualCategoria, actualSubCategoria) => {
    let fragment = "";
    let element;
    if (actual == 1) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/productos/todos/${Number(actual) - 1}?categoria=${actualCategoria}&subCat=${actualSubCategoria}">Previous</a></li>`;
    }
    fragment = fragment + element;
    for (let i = 1; i <= numero; i++) {
        if (i == actual) {
            element = `<li class="page-item disabled"><a class="page-link" href="#">${i}</a></li>`;
        } else {
            element = `<li class="page-item"><a class="page-link" href="/productos/todos/${i}?categoria=${actualCategoria}&subCat=${actualSubCategoria}">${i}</a></li>`;
        }
        fragment = fragment + element;
    }
    if (numero == actual) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/productos/todos/${Number(actual) + 1}?categoria=${actualCategoria}&subCat=${actualSubCategoria}">Next</a></li>`;
    }
    fragment = fragment + element;
    return fragment;
}

helpers.pagProd = (numero, actual, actualEstado) => {
    let fragment = "";
    let element;
    if (actual == 1) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/venta/${Number(actual) - 1}?estado=${actualEstado}">Previous</a></li>`;
    }
    fragment = fragment + element;
    for (let i = 1; i <= numero; i++) {
        if (i == actual) {
            element = `<li class="page-item disabled"><a class="page-link" href="#">${i}</a></li>`;
        } else {
            element = `<li class="page-item"><a class="page-link" href="/venta/${i}?estado=${actualEstado}">${i}</a></li>`;
        }
        fragment = fragment + element;
    }
    if (numero == actual) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/venta/${Number(actual) + 1}?estado=${actualEstado}">Next</a></li>`;
    }
    fragment = fragment + element;
    return fragment;
}

helpers.date = (date) => {
    return moment(date).format('l');
}

helpers.status = (status, idVenta, idUsuarioVenta, idUsuarioLogueado) => {
    switch (status) {
        case 'approved':
            return '<th class="text-primary">Aprobado</th>';
        case 'in_process':
            let texto = `<th class="text-warning">En processo</th>`;
            if(typeof idUsuarioVenta !== 'undefined' && idUsuarioVenta.equals(idUsuarioLogueado)) {
                return `<th class="text-warning"><a class="page-link" href="/venta/reiniciar/${idVenta}">En processo</a></th>`;
            } 
            return texto;
        case 'rejected':
            let text = `<th class="text-danger">Rechazado</th>`;
            if(typeof idUsuarioVenta !== 'undefined' && idUsuarioVenta.equals(idUsuarioLogueado)) {
                text = `<th class="text-danger"><a class="page-link" href="/venta/reiniciar/${idVenta}">Rechazado</a></th>`;
            } 
            return text;
        case 'efectivo':
            return '<th class="text-success">Efectivo</th>';
    }
}

helpers.estado = (item, actual) => {
    return (item == actual);
}

helpers.imagen = (img) => {
    return (img == null) ? 'sinimagen.png' : img;
}

helpers.estadoBoton = (status) => {
    return (status == "in_process" || status == "rejected") ? 'disabled' : '';
}

module.exports = helpers;