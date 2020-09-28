const express = require('express');
const mailer = require('../lib/mailer');
const router = express.Router();
const Productos = require('../model/producto');
const Categorias = require('../model/categoria');

router.get('/', async (req, res) => {
    const count = await Productos.countDocuments().where('estado').equals(true).where('destacado').equals(true);
    const productos = await Productos.find()
        .where('estado').equals(true)
        .where('destacado').equals(true)
        .populate({ path: 'marca_id', select: 'marca' })
        .lean();
    const categorias = await Categorias.find()
        .where('estado').equals(true)
        .populate({ path: 'categoriaPadre' })
        .lean();
    let list = [];
    const number = [];
    if(count > 6) {
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
    const { nombre, telefono, email, sector, comentario} = req.body;
    if(nombre === '' || telefono === ''  || email === '' || sector === '' || comentario === '') {
        res.render('', {
            comentario:  { nombre, telefono, email, sector, comentario},
            danger: 'Debe completar todos los campos'
        });
        return
    }
    mailer.contacto({nombre, telefono, email, sector, comentario});
    req.flash('success', 'Contacto enviado de forma correcta')
    res.redirect('/');
});

router.get('/todos', async (req, res) => {
    const productos =  await Productos.find()
        .where('estado').equals(true)
        .populate({ path: 'marca_id', select: 'marca' })
        .lean();
    const categorias = await Categorias.find()
        .where('estado').equals(true)
        .populate({ path: 'categoriaPadre' })
        .lean();
    res.render('productos', {
        productos:productos,
        categorias: categorias
    });
});

router.get('/ver/:id', async (req, res) => {
    const producto = await Productos.findById({_id: req.params.id})
        .populate({ path: 'marca_id', select: 'marca' })
        .lean();
    const categorias = await Categorias.find()
        .where('estado').equals(true)
        .populate({ path: 'categoriaPadre' })
        .lean();
    res.render('vistaProducto', {
       producto: producto,
       categorias: categorias 
    });
});

module.exports = router;