const express = require('express');
const router = express.Router();
const Marca = require('../model/marca');
const errorMessage = require('../lib/errorMessageValidation');
const Producto = require('../model/producto');

router.get('/', async (req, res) => {
    const marcas = await Marca.find().lean();
    res.render('marcas/', {
        titulo: 'Agregar Marca',
        boton: 'Guardar',
        action: '/marcas',
        marcas: marcas
    });
});

router.post('/', async (req, res) => {
    const value = req.body;
    const marca = new Marca({...value})
    try {
        await marca.save();
        req.flash('success', 'Marca Ingresada de Forma Correcta');
        res.redirect('/marcas');
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        const marcas = await Marca.find().lean();
        res.render('marcas/', {
            titulo: 'Agregar Marca',
            boton: 'Guardar',
            action: '/marcas',
            marcas: marcas,
            e: mensaje,
            value: value.marca
        });
    }
});

router.get('/editar/:id', async (req, res) => {
    const marca = await Marca.findById({ _id: req.params.id }).lean();
    const marcas = await Marca.find().lean();
    res.render('marcas/', {
        titulo: 'Editar Marca',
        boton: 'Editar',
        action: `/marcas/editar/${marca._id}`,
        marcas: marcas,
        value: marca.marca
    });
});

router.post('/editar/:id', async (req, res) => {
    try {
        await Marca.findByIdAndUpdate({ _id: req.params.id }, { marca: req.body.marca }, { runValidators: true });
        req.flash('success', 'Marca Actualizada');
        res.redirect('/marcas')
    } catch (error) {
        const marcas = await Marca.find().lean();
        const mensaje = errorMessage.crearMensaje(error);
        res.render('marcas/', {
            titulo: 'Editar Marca',
            boton: 'Editar',
            action: `/marcas/editar/${req.params.id}`,
            e: mensaje,
            marcas: marcas,
            value: req.body.marca
        });
    }
});

router.delete('/eliminar/:id', async (req, res) => {
    await Marca.findByIdAndDelete({_id: req.params.id})
    req.flash('success', 'Marca Eliminada de Forma Correcta');
    res.status(200).json('Ok');
});

router.put('/estado/:id', async (req, res) => {
    const estado = req.body.estado;
    await Marca.findByIdAndUpdate({ _id: req.params.id }, { estado: !estado });
    if (estado) await Producto.updateMany({estado: false}).where('marca_id').equals(req.params.id)
    req.flash('success', 'Estado Modificado de Forma Correcta');
    res.status(200).json('Ok');
});

router.get('/buscar/:estado', async (req, res) => {
    const marcas = await Marca.find({'estado': req.params.estado}).lean();
    const estado = JSON.parse(req.params.estado) ? {nombre: 'activos', value: 'true'} : {nombre: 'inactivos', value: 'false'};
    res.render('marcas/', {
        titulo: 'Agregar Marca',
        boton: 'Guardar',
        action: '/marcas',
        marcas: marcas,
        estadoActual: estado
    });
});

module.exports = router;