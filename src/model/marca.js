const { Schema, model } = require('mongoose');

const schemaMarca = new Schema({
    marca: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [15,"Marca muy largo maximo 15 caracteres!"]
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    }
});

module.exports = model('marca', schemaMarca);