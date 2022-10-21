const express = require('express');
const router = express.Router();
const Carrito = require('../model/carrito');
const Venta = require('../model/venta');
const Producto = require('../model/producto');
const { generarPago, generarPagoRechazado } = require('../lib/mercadopago');
const { logAdmin, logueado } = require('../lib/auth');
const generarPDF = require('../lib/createInvoice');

router.post('/pagar', async (req, res) => {
    console.log(req.body);
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
        detalle: detalleVenta,
        direccion: factura.direccion
    });
    generarPDF.createInvoice(venta, req.user, venta._id);
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
        await venta.save();
    } catch (error) {
        console.log(error)
    }
    req.session.destroy();
    res.render('ventas/failure', {
        venta: venta.total_venta
    });
});

router.get('/pending', async(req, res) => {
    const { status, payment_id, merchant_order_id } = req.query;
    let venta;
    try {
        venta = new Venta({...req.session.venta, status, payment_id, merchant_order_id });
        await venta.save();
    } catch (error) {
        console.log(error)
    }
    req.session.destroy();
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
            prod.stock = prod.stock - det.cantidad;
            await Producto.updateOne({_id: prod._id}, {stock: prod.stock});
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

router.get('/:pagina', logueado, async (req, res) => {
    const porPagina = 6;
    const pagina = req.params.pagina || 1;
    let estado = {};
    if (req.query.estado) estado = { status: req.query.estado };
    if (req.user.role === 'USER_ROLE') estado = { ...estado, id_usuario: req.user._id };
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
    // const userId = (req.user.role === 'USER_ROLE') ? req.user._id : '';
    res.render('ventas/listadoVentas', {
        ventas: ventas,
        estados: estados,
        actualEstado: req.query.estado || '',
        paginacion: Math.ceil(count / porPagina),
        actual: pagina,
        userId: req.user._id
    });
});

router.get('/detalle/:id', logueado, async (req, res) => {
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

router.get('/api/todo', async (req, res) => {
    const ventas = await Venta.find()
        .populate({ path: 'id_usuario', select: 'nombre apellido email' })
        .populate({path: 'detalle',
            populate: {
                path: 'id_producto',
                model: 'producto',
                select: 'nombre descripcion'
            } 
        });
    res.json(ventas);
});

router.get('/api/:id', async (req, res) => {
    const ventas = await Venta.findById(req.params.id)
        .populate({ path: 'id_usuario', select: 'nombre apellido email' })
        .populate({path: 'detalle',
            populate: {
                path: 'id_producto',
                model: 'producto',
                select: 'nombre descripcion'
            } 
        });
    res.json(ventas);
});

router.get('/reiniciar/:id', async (req, res) => {
    const venta = await Venta.findById(req.params.id)
        .populate({path: 'detalle',
            populate: {
                path: 'id_producto',
                model: 'producto',
                select: 'nombre descripcion precio img'
            } 
        })
        .lean();
    const urlPago = await generarPagoRechazado(venta.detalle, venta._id, req.user);
    res.render("ventas/reiniciar", {
        productos: venta,
        precioTotal: venta.total_venta,
        urlPago: urlPago
    });
});

router.get('/aprobado/reinicio', async (req, res) => {
    console.log("hola");
    const { external_reference, status, payment_id, merchant_order_id } = req.query;
    
    await Venta.updateOne(
        {_id: external_reference}, 
        {
            status: status,
            merchant_order_id: merchant_order_id,
            payment_id: payment_id
        }
    );
    const venta = await Venta.findById(external_reference);
    venta.detalle.forEach(async det => {
        const prod = await Producto.findById({_id: det.id_producto});
        prod.cantidad = prod.cantidad - det.cantidad;
        await Producto.updateOne({_id: prod._id}, {cantidad: prod.cantidad});
    });
    req.session.destroy();
    res.render('ventas/success', {
        venta: venta.total_venta
    });
});

module.exports = router;