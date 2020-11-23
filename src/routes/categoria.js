const express = require('express');
const router = express.Router();
const errorMessage = require('../lib/errorMessageValidation');
const categoriaSchema = require('../model/categoria');
const productoSchema = require('../model/producto');
const { logAdmin } = require('../lib/auth');

router.get('/', logAdmin, async (req, res) => {
    const categorias = await categoriaSchema.find().lean();
    const categoriasPadre = await categoriaSchema.find({categoriaPadre: "0"}).lean();
    res.render('categorias', {
        titulo: 'Agregar categoría',
        boton: 'Guardar',
        action: '/categorias',
        categoriasPadre: categoriasPadre,
        categorias: categorias
    });
});

router.post('/', logAdmin, async (req, res) => {
    const value = req.body;
    const categoria = new categoriaSchema();
    categoria.nombre = value.nombre;
    categoria.categoriaPadre = value.categoriaPadre != "" ? value.categoriaPadre : "0";

    try {
        await categoria.save();
        req.flash('success', 'Categoría ingresada correctamente.');
        res.redirect('/categorias');
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        const categorias = await categoriaSchema.find().lean();
        res.render('categorias', {
            titulo: 'Agregar categoría',
            boton: 'Guardar',
            action: '/categorias',
            categorias: categorias,
            e: mensaje,
            value: value.categoria
        });
    }
});

router.get('/editar/:id', logAdmin, async (req, res) => {
    const categoria = await categoriaSchema.findById({ _id: req.params.id }).lean();
    const categorias = await categoriaSchema.find({ _id: { $ne: req.params.id} }).lean();
    const categoriasPadre = await categoriaSchema.find({categoriaPadre: "0"}).lean();
    res.render('categorias', {
        titulo: 'Editar categoría',
        boton: 'Editar',
        action: `/categorias/editar/${categoria._id}`,
        categorias: categorias,
        value: categoria.nombre,
        categoriasPadre: categoriasPadre,
    });
});

router.post('/editar/:id', logAdmin, async (req, res) => {
    try {
        const categoriaPadre = req.body.categoriaPadre != "" ? req.body.categoriaPadre : "0";
        await categoriaSchema.findByIdAndUpdate({ _id: req.params.id }, { marca: req.body.marca,  categoriaPadre: categoriaPadre}, { runValidators: true });
        req.flash('success', 'Categoría actualizada');
        res.redirect('/categorias')
    } catch (error) {
        const categorias = await categoriaSchema.find({ _id: { $ne: req.params.id} }).lean();
        const mensaje = errorMessage.crearMensaje(error);
        res.render('categorias/', {
            titulo: 'Editar categoría',
            boton: 'Editar',
            action: `/categorias/editar/${req.params.id}`,
            e: mensaje,
            categorias: categorias,
            value: req.body.nombre
        });
    }
});

router.delete('/eliminar/:id', logAdmin, async (req, res) => {
    await categoriaSchema.findByIdAndDelete({_id: req.params.id})
    req.flash('success', 'Categoría eliminada correctamente.');
    res.status(200).json('Ok');
});

router.put('/estado/:id', logAdmin, async (req, res) => {
    const estado = req.body.estado;
    await categoriaSchema.findByIdAndUpdate({ _id: req.params.id }, { estado: !estado });
    if (estado) await productoSchema.updateMany({estado: false}).where('mid_prod_cat').equals(req.params.id)
    req.flash('success', 'Estado modificado correctamente.');
    res.status(200).json('Ok');
});

router.get('/buscar/:estado', logAdmin, async (req, res) => {
    const categorias = await categoriaSchema.find({'a': req.params.estado}).lean();
    const estado = JSON.parse(req.params.estado) ? {nombre: 'Activas', value: 'true'} : {nombre: 'Inactivas', value: 'false'};
    res.render('categorías/', {
        titulo: 'Agregar categoría',
        boton: 'Guardar',
        action: '/categorías',
        categorias: categorias,
        estadoActual: estado
    });
});

module.exports = router;