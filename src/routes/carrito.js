const express = require('express');
const router = express.Router();
const Carrito = require('../model/carrito');
const Producto = require('../model/producto');

router.get("/agregar/:id/:cantidad", async (req, res) => {
  const productId = req.params.id;
  const cantidad = req.params.cantidad
  try {
    const carrito = new Carrito(req.session.carrito ? req.session.carrito : {});
    const producto = await Producto.findById({_id: productId});
    if (producto.cantidad >= cantidad && cantidad > 0) {
      carrito.add(producto, productId, cantidad);
      req.session.carrito = carrito;
      console.log(req.session.carrito);
      req.flash('success', 'Producto agregado correctamente');
      res.redirect("/");
    } else {
      req.flash('danger', 'Cantidad fuera de stock');
      res.redirect("/ver/productId");
    }
  } catch (error) {
    req.flash('danger', 'Ocurrio un problema agregando el producto');
    res.redirect("/");
  }
});

router.get("/reduce/:id", (req, res) => {
  const productId = req.params.id;
  const cart = new Carrito(req.session.carrito ? req.session.carrito : {});
  cart.reduceByOne(productId);
  req.session.carrito = cart;
  res.redirect("/carrito");
});

router.get("/add/:id", (req, res) => {
  const productId = req.params.id;
  const cart = new Carrito(req.session.carrito ? req.session.carrito : {});
  cart.addByOne(productId);
  req.session.carrito = cart;
  res.redirect("/carrito");
});

router.get("/remove/:id", function (req, res) {
  const productId = req.params.id;
  const cart = new Carrito(req.session.carrito ? req.session.carrito : {});
  cart.removeItem(productId);
  req.session.carrito = cart;
  req.flash('success', 'Producto eliminado correctamente')
  res.redirect("/carrito");
});

router.get("/", (req, res) => {
  if (!req.session.carrito) {
    return res.render("carrito/carrito", {
      productos: null,
    });
  }
  const carrito = new Carrito(req.session.carrito);
  res.render("carrito/carrito", {
    productos: carrito.generateArray(),
    precioTotal: carrito.totalPrice,
  });
});

module.exports = router;