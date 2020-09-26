const { Schema, model } = require('mongoose');

const categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [50,"La cantidad máxima de caracteres es 50."]
    },
    categoriaPadre: {
        type: Schema.Types.ObjectId,
        ref: 'categoriaPadre'
    }
});

module.exports = model('categoria', categoriaSchema);