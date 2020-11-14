const express = require('express');
const router = express.Router();
const Carrito = require('../model/carrito');
const Venta = require('../model/venta');
const Producto = require('../model/producto');
const { generarPago } = require('../lib/mercadopago');

router.post('/pagar', async (req, res) => {
    if (!req.isAuthenticated() || !req.session.carrito) {
        req.flash('danger', 'Debe ingresar al sistema para pagar');
        res.redirect('/carrito');
    }
    const carrito = new Carrito(req.session.carrito);
    const factura = req.body;
    let urlPago;
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
        forma_pago: factura.efectivo == 'on' ? 'transferencia' : 'mercadopago',
        detalle: detalleVenta
    });
    req.session.venta = venta;
    if (factura.mercadoPago) {
        urlPago = await generarPago(elementosCarrito, venta._id, req.user);
    }
    if (factura.efectivo) {
        urlPago = '/venta/efectivo'
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
    let venta;
    try {
        venta = new Venta({...req.session.venta, status, payment_id, merchant_order_id });
        await venta.save();
        venta.detalle.forEach(async det => {
            const prod = await Producto.findById({_id: det.id_producto});
            prod.cantidad = prod.cantidad - det.cantidad;
            await Producto.updateOne({_id: prod._id}, {cantidad: prod.cantidad});
        });
        req.session.destroy();
    } catch (error) {
        console.log(error)
    }
    res.render('ventas/success', {
        venta: venta.total_venta
    });
});

router.get('/failure', async(req, res) => {
    const { status, payment_id, merchant_order_id } = req.query;
    let venta;
    try {
        venta = new Venta({...req.session.venta, status, payment_id, merchant_order_id });
        const res = await venta.save();
        req.session.destroy();
    } catch (error) {
        console.log(error)
    }
    res.render('ventas/failure', {
        venta: venta.total_venta
    });
});

router.get('/pending', async(req, res) => {
    const { status, payment_id, merchant_order_id } = req.query;
    let venta;
    try {
        venta = new Venta({...req.session.venta, status, payment_id, merchant_order_id });
        const res = await venta.save();
        req.session.destroy();
    } catch (error) {
        console.log(error)
    }
    res.render('ventas/pending', {
        venta: venta.total_venta
    });
});

router.get('/efectivo', async(req, res) => {
    let venta;
    try {
        venta = new Venta({...req.session.venta, status: 'efectivo' });
        await venta.save();
        venta.detalle.forEach(async det => {
            const prod = await Producto.findById({_id: det.id_producto});
            prod.cantidad = prod.cantidad - det.cantidad;
            await Producto.updateOne({_id: prod._id}, {cantidad: prod.cantidad});
        });
        req.session.destroy();
    } catch (error) {
        console.log(error)
        return
    }
    res.render('ventas/efectivo', {
        venta: venta.total_venta
    });
});

router.get('/:pagina', async (req, res) => {
    const porPagina = 6;
    const pagina = req.params.pagina || 1;
    let estado = {};
    if (req.query.estado) estado = { status: req.query.estado };
    const [count, ventas] = await Promise.all([
        Venta.countDocuments(estado),
        Venta.find(estado)
            .select('-detalle')
            .populate({ path: 'id_usuario', select: 'nombre apellido' })
            .sort({fecha: -1})
            .skip((porPagina * pagina) - porPagina)
            .limit(porPagina)
            .lean()
    ]);
    const estados = Venta.schema.path('status').enumValues;
    res.render('ventas/listadoVentas', {
        ventas: ventas,
        estados: estados,
        actualEstado: req.query.estado || '',
        paginacion: Math.ceil(count / porPagina),
        actual: pagina,
    });
});

router.get('/detalle/:id', async (req, res) => {
    console.log(req.params.id);
    const venta = await Venta.findById(req.params.id)
        .populate({path: 'detalle',
            populate: {
                path: 'id_producto',
                model: 'producto',
                select: 'nombre'
            } 
        });
    res.json(venta.detalle);
});

module.exports = router;