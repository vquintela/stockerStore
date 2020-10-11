const { Schema, model } = require('mongoose');

const comentarioSchema = new Schema({
    fecha: { //se crea automáticamente
        type: Date,
        default: Date.now
    },
    contenido:{
        type: String,
        required: [true, "Campo requerido."]
    },
    ranqueo:{ //se crea/actualiza automáticamente
        type: Number,
        min: 1,
        max: 5
    },
    producto: { //se asigna automáticamente
        type: Schema.Types.ObjectId,
        ref: 'producto'
    },
});

module.exports = model('comentario', comentarioSchema);