const moment = require('moment');
moment.locale('es')
const helpers = {}

helpers.for = (numero, actual, categoria, destacado, orden) => {
    let fragment = "";
    let element;
    if (actual == 1) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/todos/${categoria}/${Number(actual) - 1}?destacado=${destacado}&orden=${orden}">Previous</a></li>`;
    }
    fragment = fragment + element;
    for (let i = 1; i <= numero; i++) {
        if (i == actual) {
            element = `<li class="page-item disabled"><a class="page-link" href="#">${i}</a></li>`;
        } else {
            element = `<li class="page-item"><a class="page-link" href="/todos/${categoria}/${i}?destacado=${destacado}&orden=${orden}">${i}</a></li>`;
        }
        fragment = fragment + element;
    }
    if (numero == actual) {
        element = `<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>`;
    } else {
        element = `<li class="page-item"><a class="page-link" href="/todos/${categoria}/${Number(actual) + 1}?destacado=${destacado}&orden=${orden}">Next</a></li>`;
    }
    fragment = fragment + element;
    return fragment;
}

helpers.date = (date) => {
    return moment(date).format('l');
}

helpers.status = (status) => {
    switch (status) {
        case 'approved':
            return '<th class="text-primary">Aprobado</th>';
        case 'in_process':
            return '<th class="text-warning">En processo</th>';
        case 'rejected':
            return '<th class="text-danger">Rechazado</th>';
        case 'efectivo':
            return '<th class="text-success">Efectivo</th>';
    }
}

helpers.estado = (item, actual) => {
    if(item == actual) return 'selected';
}

module.exports = helpers;