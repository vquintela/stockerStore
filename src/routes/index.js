const express = require('express');
const mailer = require('../lib/mailer');
const router = express.Router();
const Productos = require('../model/producto');

router.get('/', async (req, res) => {
    const count = await Productos.countDocuments().where('estado').equals(true).where('destacado').equals(true);
    const productos = await Productos.find()
        .where('estado').equals(true)
        .where('destacado').equals(true)
        .populate({ path: 'marca_id' })
        .lean();
    const list = [];
    const number = [];
    while (list.length < 6) {
        const rand = Math.floor(Math.random() * count);
        if (!number.includes(rand)) {
            number.push(rand);
            list.push(productos[rand])
        }
    }
    res.render('', {
        productos: list
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

module.exports = router;