const express = require('express');
const User = require('../model/users');
const router = express.Router();
const errorMessage = require('../lib/errorMessageValidation');
const mailer = require('../lib/mailer');

router.get('/', async (req, res) => {
    const usuarios = await User.find().select('-password').lean();
    const roles = User.schema.path('rol').enumValues;
    res.render('users', { 
        usuarios: usuarios,
        roles: roles 
    });
});

router.get('/crear', (req, res) => {
    const roles = User.schema.path('rol').enumValues;
    res.render('users/crear', { 
        roles: roles,
        titulo: 'Crear Usuario',
        boton: 'Crear',
        accion: '/users/crear'
    });
});

router.post('/crear', async (req, res) => {
    const values = req.body;
    const estado = true;
    const user = new User({ ...values, estado});
    const password = user.genPass();
    user.password = await user.encryptPassword(password);
    try {
        await user.save();
        await mailer.renew(user.email, user.nombre, user.apellido, password);
        req.flash('success', 'Usuario Ingresado de Forma Correcta');
        res.redirect('/users');
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        const roles = User.schema.path('rol').enumValues;
        res.render('users/crear', { 
            usuario: values, 
            e: mensaje, 
            roles: roles,
            titulo: 'Crear Usuario',
            boton: 'Crear',
            accion: '/users/crear'
        });
    }
});

router.get('/editar/:id', async (req, res) => {
    const usuario = await User.findById({_id: req.params.id}).select('-password').lean();
    const roles = User.schema.path('rol').enumValues;
    res.render('users/crear', { 
        usuario: usuario, 
        roles: roles,
        titulo: 'Editar Usuario',
        boton: 'Editar',
        accion: `/users/editar/${req.params.id}`,
        leer: true
    });
});

router.post('/editar/:id', async (req, res) => {
    const { nombre, apellido, rol } = req.body;
    try {
        await User.findByIdAndUpdate({_id: req.params.id}, { nombre, apellido, rol }, { runValidators: true });
        req.flash('success', 'Usuario Editado de Forma Correcta');
        res.redirect('/users')
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        const roles = User.schema.path('rol').enumValues;
        res.render('users/crear', { 
            usuario: req.body, 
            e: mensaje, 
            roles: roles,
            titulo: 'Editar Usuario',
            boton: 'Editar',
            accion: `/users/editar/${req.params.id}`,
            leer: true
        });
    }
});

router.delete('/eliminar/:id', async (req, res) => {
    await User.findByIdAndDelete({_id: req.params.id})
    req.flash('success', 'Usuario Eliminado de Forma Correcta');
    res.status(200).json('Ok');
});

router.put('/estado/:id', async (req, res) => {
    const estado = req.body.estado;
    await User.findByIdAndUpdate({ _id: req.params.id }, { estado: !estado });
    req.flash('success', 'Estado Modificado de Forma Correcta');
    res.status(200).json('Ok');
});

router.get('/buscar/:estado/:rol', async (req, res) => {
    const rol = req.params.rol;
    let estado = req.params.estado;
    let usuarios
    if (rol === 'todos') {
        usuarios = await User.find().select('-password').lean();
    } else {
        usuarios = await User.find({rol: rol}).select('-password').lean();
    }
    if (estado !== 'todos') {
        usuarios = usuarios.filter(user => user.estado == JSON.parse(estado));
        estado = JSON.parse(estado) ? {nombre: 'activos', value: 'true'} : {nombre: 'bloqueados', value: 'false'};
    } else {
        estado = {nombre: 'Estado Usuario', value: 'todos'};
    }
    const roles = User.schema.path('rol').enumValues;
    res.render('users', { 
        usuarios: usuarios,
        roles: roles,
        rolActual: rol,
        estadoActual: estado
    });
});

router.get('/newpws', (req, res) => {
    res.render('users/newpws')
});

router.post('/newpws/:id', async (req, res) => {
    const { id } = req.params;
    const e = req.body;
    if(!e.passwordActual.trim() || !e.nuevaPass.trim() || !e.repNuevaPass.trim()) {
        res.render('users/newpws', { 
            e: e,
            danger: 'Debe ingresar todos los campos'
        });
        return
    }
    if(e.nuevaPass === e.repNuevaPass){
        const user = await User.findById(id);
        const validate = await user.validatePass(e.nuevaPass);
        if (!validate) {
            res.render('users/newpws', { 
                e: e,
                danger: 'La password ingresada no cumple los requisitos'
            });
            return
        }
        const pass = await user.comparePassword(e.passwordActual, user.password)
        if(pass) {
            const password = await user.encryptPassword(e.nuevaPass);
            await user.updateOne({password: password});
            req.flash('success', 'Password cambiada');
            res.redirect('/users');
        } else {
            res.render('users/newpws', { 
                e: e,
                danger: 'La password ingresada no es correcta'
            });
        }
    } else{
        res.render('users/newpws', { 
            e: e,
            danger: 'Las password no coinciden'
        });
    }
})

module.exports = router;