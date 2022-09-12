const express = require('express');
const router = express.Router();
const moment = require("moment");
const Users = require('../model/users');
const Venta = require('../model/venta');
const Producto = require('../model/producto');

router.get('/', async (req, res) => {
    if (req.user.rol === 'ADMIN_ROLE') {
        const cantUser = await Users.countDocuments();
        const cantProd = await Producto.countDocuments();
        const fecha = moment();
        const prodHoy = await Venta.countDocuments().where('fecha').gte(fecha);

        res.render('dashboard/admindash', {
            prodHoy: prodHoy,
            cantUser: cantUser,
            cantProd: cantProd,
        });
    } else {
        console.log(req.user)
        const ventasUser = await Venta.countDocuments().where('id_usuario').equals(req.user._id)

        res.render('dashboard/userdash', {
            ventasUser: ventasUser

        })
    }
});


module.exports = router;