const express = require('express');
const router = express.Router();
const Carrito = require('../model/carrito');
const Producto = require('../model/producto');

router.get("/agregar/:id", async (req, res) => {
  const productId = req.params.id;
  const carrito = new Carrito(req.session.carrito ? req.session.carrito : {});
  try {
    const producto = await Producto.findById(productId);
    carrito.add(producto, productId);
    req.session.carrito = carrito;
    console.log(req.session.carrito);
    req.flash('success', 'Producto agregado correctamente');
    res.redirect("/");
  } catch (error) {
    req.flash('danger', 'Ocurrio un problema agregando el producto');
    res.redirect("/");
  }
});

router.get("/reduce/:id", (req, res) => {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect("/carrito");
});

router.get("/remove/:id", function (req, res) {
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  cart.removeItem(productId);
  req.session.cart = cart;
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