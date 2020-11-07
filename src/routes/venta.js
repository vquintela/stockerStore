const express = require('express');
const router = express.Router();
const Carrito = require('../model/carrito');
const Venta = require('../model/venta');
const { generarPago } = require('../lib/mercadopago');

router.post('/pagar', async (req, res) => {
    if (!req.isAuthenticated() || !req.session.carrito) {
        req.flash('danger', 'Debe ingresar al sistema para pagar');
        res.redirect('/carrito');
    }
    const carrito = new Carrito(req.session.carrito);
    const factura = req.body;
    let urlPago;
    if (factura.mercadoPago) {
        const detalleVenta = [];
        const elementosCarrito = carrito.generateArray();
        elementosCarrito.forEach(elemento => {
            const item = {
                id_producto: elemento.item._id,
                cantidad: elemento.qty,
                precio: elemento.item.precio
            }
            detalleVenta.push(item)
        });
        const venta = new Venta({
            id_usuario: req.user._id,
            total_venta: carrito.totalPrice,
            forma_pago: 'mercadopago',
            detalle: detalleVenta
        });
        req.session.venta = venta;
        urlPago = await generarPago(elementosCarrito, venta._id, req.user);
    }
    if (factura.efectivo) {
        urlPago = '/pagar/efectivo'
    }
    res.render("ventas", {
        productos: carrito.generateArray(),
        precioTotal: carrito.totalPrice,
        factura: factura,
        urlPago: urlPago
    });
});

router.get('/success', async (req, res) => {
    const { status, payment_id, merchant_order_id } = req.query;
    try {
        const venta = new Venta({...req.session.venta, status, payment_id, merchant_order_id });
        const res = await venta.save();
        req.session.destroy();
    } catch (error) {
        console.log(error)
    }
    res.render('ventas/success');
});

module.exports = router;