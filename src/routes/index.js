const express = require('express');
const mailer = require('../lib/mailer');
const router = express.Router();
const Productos = require('../model/producto');
const Categorias = require('../model/categoria');
const Comentarios = require('../model/comentario')

router.get('/', async (req, res) => {
    const [count, productos, categorias] = await Promise.all([
        Productos.countDocuments().where('estado').equals(true).where('destacado').equals(true),
        Productos.find()
            .where('estado').equals(true)
            .where('destacado').equals(true)
            .populate({ path: 'marca_id', select: 'marca' })
            .lean(),
        Categorias.find({estado: true, categoriaPadre: "0"}).lean()
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
        categorias: categorias
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
    mailer.contacto({ nombre, telefono, email, sector, comentario });
    req.flash('success', 'Contacto enviado de forma correcta')
    res.redirect('/');
});

router.get('/todos/:categoria/:pagina', async (req, res) => {
    const porPagina = 6;
    const pagina = req.params.pagina || 1;
    const categoria = req.params.categoria;
    let consulta = categoria != 'todos' ? { id_prod_cat: categoria } : {};
    if (req.query.destacado) consulta = { ...consulta, destacado: req.query.destacado };
    if (req.query.subCat) consulta = { ...consulta, id_prod_cat_padre: req.query.subCat };
    let orden = {};
    if (req.query.orden) orden = { nombre: req.query.orden };
    const [count, productos, categorias, subCategorias] = await Promise.all([
        Productos.countDocuments({ ...consulta, estado: true }),
        Productos.find({ ...consulta, estado: true })
            .populate({ path: 'marca_id', select: 'marca' })
            .sort(orden)
            .skip((porPagina * pagina) - porPagina)
            .limit(porPagina)
            .lean(),
        Categorias.find({estado: true, categoriaPadre: "0"}).lean(),
        Categorias.find({estado: true, categoriaPadre: categoria}).lean()
    ]);
    res.render('productos', {
        productos: productos,
        categorias: categorias,
        paginacion: Math.ceil(count / porPagina),
        actual: pagina,
        categoria: categoria,
        destacado: req.query.destacado || '',
        orden: req.query.orden || '',
        subCategorias: subCategorias,
        actualCategoria: req.params.categoria,
        actualSubCat: req.query.subCat || ''
    });
});

router.get('/ver/:id', async (req, res) => {
    const [producto, categorias, comentarios] = await Promise.all([
        Productos.findById({ _id: req.params.id })
            .populate({ path: 'marca_id', select: 'marca' })
            .lean(),
        Categorias.find({estado: true, categoriaPadre: "0"}).lean(),
        Comentarios.find({ producto: req.params.id })
            .sort({ fecha: -1 })
            .limit(5)
            .lean()
    ]);

    const promedio = obtenerPromedio(comentarios);

    res.render('vistaProducto', {
        producto: producto,
        categorias: categorias,
        comentarios: comentarios,
        promedio:{
            valor: promedio,
            cero: promedio === 0,
            uno: promedio > 0 && promedio < 2,
            dos: promedio >= 2 && promedio < 3,
            tres: promedio >= 3 && promedio < 4,
            cuatro: promedio >= 4 && promedio < 5,
            cinco: promedio == 5,
        }
    });
});

const obtenerPromedio = (comentarios) => {
    const ranqueos = comentarios.map(c => c.ranqueo);
    
    if(ranqueos.length === 0)
        return 0;

    return ranqueos.reduce((a, b) => a + b) / ranqueos.length;
};

module.exports = router;