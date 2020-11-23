const express = require('express');
const router = express.Router();
const passport = require('passport');
const mailer = require('../lib/mailer');
const User = require('../model/users');
const errorMessage = require("../lib/errorMessageValidation");
const { logueado, noLogueado } = require('../lib/auth');

router.get('/signin', noLogueado, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', noLogueado, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/signup', noLogueado, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', async (req, res) => {
    const {nombre, apellido, email, telefono, password, verificarPassword} = req.body;
    const usuario = req.body;
    if(password !== verificarPassword) {
        return res.render('auth/signup', { 
            errorpassword: 'Las contraseñas no coinciden',
            usuario: usuario
        });
    }
    const newUser = new User({nombre, apellido, email, telefono, password});
    if(!newUser.validatePass(password)) {
        return res.render('auth/signup', { 
            errorpassword: 'Las contraseña no cumple los requisitos',
            usuario: usuario
        });
    }
    newUser.password = await newUser.encryptPassword(password);
    newUser.numAut = await newUser.genPass();
    try {
        await newUser.save();
        mailer.signup(newUser.email ,newUser.nombre, newUser.apellido, newUser.numAut);
        req.flash('success', 'Usuario Registrado, verifique su email para terminar');
        res.redirect('/signin');
    } catch (error) {
        const mensaje = errorMessage.crearMensaje(error);
        res.render('auth/signup', {
            e: mensaje,
            usuario: usuario
        })
        return;
    }
});

router.get('/verifica', async (req, res) => {
    const {email, id } = req.query;
    const emailUser = await User.findOne({email: email});
    if(!emailUser) {
        res.render('auth/verificacion', {valor: false, mensaje: 'Email no registrado'});
    } else {
        if(emailUser.numAut === id) {
            newNum = emailUser.genPass();
            await emailUser.updateOne({estado: true, numAut: newNum});
            res.render('auth/verificacion', {valor: true, mensaje: `${emailUser.nombre}, ${emailUser.apellido}`});
        } else {
            res.render('auth/verificacion', {valor: false, mensaje: 'Autenticación no valida'});
        }
    }
})

router.post('/renew', logueado, async (req, res) => {
    const { email } = req.body;
    if (!email.trim()) {
        req.flash('danger', 'Ingrese su email por favor');
        return res.status(200).json('Ok');
    }
    const user = await User.findOne({email: email});
    if(user) {
        const pass = user.genPass();
        mailer.renew(user.email, user.nombre, user.apellido, pass);
        const password = await user.encryptPassword(pass);
        await user.updateOne({ password: password });
        req.flash('success', 'Se le a enviado a su email la nueva password');
        res.status(200).json('Ok');
    } else {
        req.flash('danger', 'Usuario no Registrado, registrese por favor');
        res.status(200).json('Ok');
    }
})

router.get('/logout', logueado, (req, res) => {
    req.logOut();
    res.redirect('/');
})

module.exports = router