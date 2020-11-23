const express = require('express');
const router = express.Router();
const moment = require("moment");
const Users = require('../model/users');
const Venta = require('../model/venta');
const Producto = require('../model/producto');
const Categoria = require('../model/categoria');
const Marca = require('../model/marca');

router.get('/', async (req, res) => {
    if (req.user.rol === 'administrador') {
        const cantUser = await Users.countDocuments().where('estado').equals(true);
        const cantProd = await Producto.countDocuments().where('estado').equals(true);
        const cantCat = await Categoria.countDocuments().where('estado').equals(true);
        const fecha = moment();
        const prodHoy = await Venta.countDocuments().where('fecha').gte(fecha);
        const cantMarca = await Marca.countDocuments().where('estado').equals(true);

        res.render('dashboard/admindash', {
            prodHoy: prodHoy,
            cantUser: cantUser,
            cantProd: cantProd,
            cantCat: cantCat,
            cantMarca: cantMarca,
        });
    } else {
        const ventasUser = await Venta.countDocuments().where('_id').equals(req.user._id)


        res.render('dashboard/userdash', {
            ventasUser: ventasUser

        })

    }
});


module.exports = router;