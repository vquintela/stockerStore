const { Schema, model } = require('mongoose');

const estados = {
    values: ["ACTIVO", "INACTIVO"],
    message: "{VALUE} no es un estado permitido",
};

const productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [15,"¡Nombre muy largo maximo 15 caracteres!"]
    },
    descripcion: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [1500,"¡Descripcion muy larga, maximo 1500 caracteres!"]
    },
    precio: {
        type: Number,
        required: [true, '¡Campo requerido!'],
        min: [0, '¡Solo Valor positivo!'],
        max: [1000000, '¡Valor Exagerado!']
    },
    stock: {
        type: Number,
        required: [true, '¡Campo requerido!'],
        min: [0, '¡Solo Valor positivo!'],
        max: [1000000, '¡Valor Exagerado!']
    },
    img: {
        type: String,
        default: 'sinimagen.png'
    },
    estado: {
        type: String,
        required: true,
        default: "ACTIVO",
        enum: estados
    }
});

module.exports = model('producto', productoSchema);