module.exports = function cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = (item, id, cantidad) => {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            };
        }
        storedItem.qty += parseInt(cantidad);
        storedItem.price = storedItem.item.precio * storedItem.qty;
        this.totalQty = Object.keys(this.items).length;
        this.totalPrice += storedItem.price;
    }

    this.reduceByOne = id => {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.precio;
        this.totalPrice -= this.items[id].item.precio;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    }

    this.addByOne = id => {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.precio;
        this.totalPrice += this.items[id].item.precio;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    }

    this.removeItem = function (id) {
        this.totalQty--;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.generateArray = () => {
        let arr = [];
        for (const id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }

};