module.exports = function cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = (item, id) => {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.precio * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.precio;
    }

    this.reduceByOne = id => {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.precio;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.precio;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    }

    this.addByOne = id => {
        this.items[id].qty++;
        this.items[id].price += this.items[id].item.precio;
        this.totalQty++;
        this.totalPrice += this.items[id].item.precio;

        if (this.items[id].qty <= 0) {
            delete this.items[id];
        }
    }

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].precio;
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