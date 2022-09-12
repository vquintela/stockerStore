const express = require('express');
const router = express.Router();
const Producto = require('../model/producto');
const errorMessage = require('../lib/errorMessageValidation');
const path = require('path');
const fs = require('fs-extra');
const { logAdmin } = require('../lib/auth');

router.get('/todos/:pagina', logAdmin, async (req, res) => {
    const porPagina = 8;
    const pagina = req.params.pagina || 1;
    let categorias = {};
    const [count, productos] = await Promise.all([
        Producto.countDocuments(categorias),
        Producto.find(categorias)
            .populate({ path: 'marca_id' })
            .skip((porPagina * pagina) - porPagina)
            .limit(porPagina)
            .lean(),
    ]);
    res.render('productos/', {
        productos: productos,
        paginacion: Math.ceil(count / porPagina),
        actual: pagina,
    });
});


router.get('/:id', logAdmin, async (req, res) => {
    const producto = await Producto.findById({_id: req.params.id}).lean();
    res.render('productos/crear', {
        titulo: 'Editar Producto',
        action: `/productos/${producto._id}`,
        boton: 'Editar',
        producto: producto
    });
});

module.exports = router;