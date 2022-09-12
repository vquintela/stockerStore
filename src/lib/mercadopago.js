const mercadopago = require ('mercadopago');

mercadopago.configure({
    access_token: 'TEST-440134140448878-071921-444272ac11d039247b5e747c1e3f713e-611758351'
});

const generarPago = async (carrito, factura, user) => {
    let itemsMP = [];
    carrito.forEach(element => {
        const item = {
            id: element.item._id,
            title: element.item.nombre,
            category_id: `${element.item.id_prod_cat}`,
            quantity: parseInt(element.qty), 
            currency_id: 'ARS',
            unit_price: element.item.precio
        }
        itemsMP.push(item)
    });
    let preference = {
        items: itemsMP,
        payer: {
            name: user.nombre,
            surname: user.apellido,
            email: user.email,
        },
        external_reference: `${factura}`,
        back_urls: {
            "success": "http://localhost:3010/venta/success",
            "failure": "http://localhost:3010/venta/failure",
            "pending": "http://localhost:3010/venta/pending"
        },
        auto_return: "approved"
    };
    try {
        const response = await mercadopago.preferences.create(preference);
        initPoint = response.body.init_point;
        return initPoint;
    } catch (error) {
        console.log(error)
    }
}

module.exports = { generarPago };