const express = require('express');
const mailer = require('../lib/mailer');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('');
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
    res.render('', {
        success: 'Contacto enviado de forma correcta'
    });
});

module.exports = router;