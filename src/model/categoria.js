const { Schema, model } = require('mongoose');

const categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [50,"La cantidad máxima de caracteres es 50."]
    },
    categoriaPadre: {
        type: String,
        default: "0",
        required: false,
        ref: 'categoria'
    },
    estado: {
        type: Boolean,
        default: false,
        required: true
    }
});

module.exports = model('categoria', categoriaSchema);