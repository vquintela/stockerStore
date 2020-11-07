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

module.exports = helpers;