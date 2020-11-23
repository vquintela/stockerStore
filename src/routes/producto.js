const express = require('express');
const router = express.Router();
const Marca = require('../model/marca');
const Producto = require('../model/producto');
const Categoria = require('../model/categoria');
const Comentario = require('../model/comentario');
const errorMessage = require('../lib/errorMessageValidation');
const path = require('path');
const fs = require('fs-extra');

router.get('/', async (req, res) => {
    const productos = await Producto.find().populate({ path: 'marca_id' }).lean();
    res.render('productos/', {
        productos: productos
    });
});

router.get('/crear', async (req, res) => {
    const marcas = await Marca.find().where('estado').equals(true).lean();
    const categorias = await Categoria.find({estado: true, categoriaPadre: "0"}).lean();
    res.render('productos/crear', {
        titulo: 'Crear Producto',
        action: '/productos/crear',
        boton: 'Crear',
        marcas: marcas,
        categorias: categorias
    });
});

router.post('/crear', async (req, res) => {
    const values = req.body;
    values.destacado = (values.destacado == 'on') ? true : false;
    const producto = new Producto({ ...values });
    let imagePath
    if(req.file) {
        imagePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/img/${producto._id}${ext}`);
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
            await fs.rename(imagePath, targetPath);
            const nombArch = producto._id + ext;
            producto.imagen = nombArch
        } else {
            await fs.unlink(imagePath);
            const marcas = await Marca.find().where('estado').equals(true).lean();
            marcas.forEach(mar => {
                if(mar._id == values.marca_id) values.marca_id = mar;
            });
            const categorias = await Categoria.find().where('estado').equals(true).lean();
            categorias.forEach(cat => {
                if(cat._id == values.id_prod_cat) values.id_prod_cat = cat;
            });
            res.render('productos/crear', {
                titulo: 'Crear Producto',
                action: '/productos/crear',
                boton: 'Crear',
                marcas: marcas,
                danger: 'Imagen no soportada',
                producto: values,
                categorias: categorias
            });
            return
        }
    } else {
        const marcas = await Marca.find().where('estado').equals(true).lean();
        marcas.forEach(mar => {
            if(mar._id == values.marca_id) values.marca_id = mar;
        });
        const categorias = await Categoria.find().where('estado').equals(true).lean();
        categorias.forEach(cat => {
            if(cat._id == values.id_prod_cat) values.id_prod_cat = cat;
        });
        res.render('productos/crear', {
            titulo: 'Crear Producto',
            action: '/productos/crear',
            boton: 'Crear',
            marcas: marcas,
            danger: 'Debe ingresar una imagen',
            producto: values,
            categorias: categorias
        });
        return
    }
    try {
        await producto.save();
        req.flash('success', 'Producto ingresado de forma correcta');
        res.redirect('/productos');
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        const marcas = await Marca.find().where('estado').equals(true).lean();
        marcas.forEach(mar => {
            if(mar._id == values.marca_id) values.marca_id = mar;
        });
        const categorias = await Categoria.find().where('estado').equals(true).lean();
        categorias.forEach(cat => {
            if(cat._id == values.id_prod_cat) values.id_prod_cat = cat;
        });
        if(producto.imgen != 'sinimagen.png') {
            await fs.unlink(path.resolve('./src/public/img/' + producto.imagen));
        }
        res.render('productos/crear', {
            titulo: 'Crear Producto',
            action: '/productos/crear',
            boton: 'Crear',
            marcas: marcas,
            producto: values,
            e: mensaje,
            categorias: categorias
        });
        return;
    }
});

router.delete('/eliminar/:id', async (req, res) => {
    const del = await Producto.findByIdAndDelete({_id: req.params.id});
    if (del.imagen != 'sinimagen.png') {
        await fs.unlink(path.resolve('./src/public/img/' + del.imagen));
    }
    req.flash('success', 'Producto eliminado de forma correcta');
    res.status(200).json('ok');
});

router.get('/:id', async (req, res) => {
    const producto = await Producto.findById({_id: req.params.id})
        .populate({ path: 'marca_id id_prod_cat', select: 'marca nombre'})
        .lean();
    const marcas = await Marca.find().where('estado').equals(true).lean();
    const categorias = await Categoria.find().where('estado').equals(true).lean();
    res.render('productos/crear', {
        titulo: 'Editar Producto',
        action: `/productos/${producto._id}`,
        boton: 'Editar',
        marcas: marcas,
        producto: producto,
        categorias: categorias
    });
});

router.post('/:id', async (req, res) => {
    const values = req.body;
    values.destacado = values.destacado == 'on';
    values.comentarios = values.comentarios == 'on';
    let imagePath
    if(req.file) {
        imagePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/img/${req.params.id}${ext}`);
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
            await fs.rename(imagePath, targetPath);
        } else {
            await fs.unlink(imagePath);
            const marcas = await Marca.find().where('estado').equals(true).lean();
            marcas.forEach(mar => {
                if(mar._id == values.marca_id) values.marca_id = mar;
            });
            const producto = await Producto.findById({_id: req.params.id}).select('imagen').lean();
            values.imagen = producto.imagen;
            const categorias = await Categoria.find().where('estado').equals(true).lean();
            categorias.forEach(cat => {
                if(cat._id == values.id_prod_cat) values.id_prod_cat = cat;
            });
            res.render('productos/crear', {
                titulo: 'Editar Producto',
                action: `/productos/${req.params.id}`,
                boton: 'Editar',
                marcas: marcas,
                danger: 'Imagen no soportada',
                producto: values,
                categorias: categorias
            });
            return;
        }
    } 
    try {
        await Producto.findByIdAndUpdate({ _id: req.params.id }, { ...values }, { runValidators: true });
        req.flash('success', 'Producto editado de forma correcta');
        res.redirect('/productos');
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        const marcas = await Marca.find().where('estado').equals(true).lean();
        marcas.forEach(mar => {
            if(mar._id == values.marca_id) values.marca_id = mar
        });
        const producto = await Producto.findById({_id: req.params.id}).select('imagen').lean();
        values.imagen = producto.imagen;
        const categorias = await Categoria.find().where('estado').equals(true).lean();
        categorias.forEach(cat => {
            if(cat._id == values.id_prod_cat) values.id_prod_cat = cat;
        });
        res.render('productos/crear', {
            titulo: 'Editar Producto',
            action: `/productos/${req.params.id}`,
            boton: 'Editar',
            marcas: marcas,
            producto: values,
            e: mensaje,
            categorias: categorias
        });
        return;
    }
});

router.put('/estado/:id', async (req, res) => {
    const estado = req.body.estado;
    await Producto.findByIdAndUpdate({ _id: req.params.id }, { estado: !estado });
    req.flash('success', 'Estado Modificado de Forma Correcta');
    res.status(200).json('Ok');
});

router.post('/comentar/:id', (req, res)=>{
    const comentario = new Comentario({ ...req.body });
    comentario.save()
    .then(response => res.send(response))

});

router.get('/subcat/:id', async (req, res) => {
    try {
        const subCat = await Categoria.find({categoriaPadre: req.params.id}).lean();
        res.status(200).json(subCat);
    } catch (error) {
        res.status(400).json('LPM algo paso');
    }

});

module.exports = router;