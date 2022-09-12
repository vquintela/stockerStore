const express = require('express');
const router = express.Router();
const Productos = require('../model/producto');

router.get('/', async (req, res) => {
    const [count, productos] = await Promise.all([
        Productos.countDocuments(),
        Productos.find().lean(),
    ]);
    let list = [];
    const number = [];
    if (count > 6) {
        while (list.length < 6) {
            const rand = Math.floor(Math.random() * count);
            if (!number.includes(rand)) {
                number.push(rand);
                list.push(productos[rand])
            }
        }
    } else {
        list = productos;
    }
    res.render('', {
        productos: list,
    });
});

router.post('/', async (req, res) => {
    const { nombre, telefono, email, sector, comentario } = req.body;
    if (nombre === '' || telefono === '' || email === '' || sector === '' || comentario === '') {
        res.render('', {
            comentario: { nombre, telefono, email, sector, comentario },
            danger: 'Debe completar todos los campos'
        });
        return
    }
    // mailer.contacto({ nombre, telefono, email, sector, comentario });
    req.flash('success', 'Contacto enviado de forma correcta')
    res.redirect('/');
});

router.get('/todos/:pagina', async (req, res) => {
    const porPagina = 6;
    const pagina = req.params.pagina || 1;
    let orden = {};
    if (req.query.orden) orden = { nombre: req.query.orden };
    const [count, productos] = await Promise.all([
        Productos.countDocuments(),
        Productos.find()
            .sort(orden)
            .skip((porPagina * pagina) - porPagina)
            .limit(porPagina)
            .lean(),
    ]);
    res.render('productos', {
        productos: productos,
        paginacion: Math.ceil(count / porPagina),
        actual: pagina,
        orden: req.query.orden || '',
    });
});

router.get('/ver/:id', async (req, res) => {
    const producto = await Productos.findById({ _id: req.params.id }).lean();

    res.render('vistaProducto', {
        producto: producto,
    });
});

module.exports = router;