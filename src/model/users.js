const { Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
const generate = require('generate-password');
const uniqueValidator = require('mongoose-unique-validator');

const rolesValidos = {
    values: ["ADMIN_ROLE", "USER_ROLE", "SALES_ROLE", "DEPOSIT_ROLE"],
    message: "{VALUE} no es un rol permitido ",
};

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [15,"¡Nombre muy largo maximo 15 caracteres!"]
    },
    apellido: {
        type: String,
        required: [true, '¡Campo obligatorio!'],
        maxlength: [15,"¡Apellido muy largo maximo 15 caracteres!"]
    },
    empresa: {
        type: String,
        required: [true, "El nombre de la empresa es necesario"],
        default: "Cliente Final"
    },
    email: { 
        type: String,
        unique: true,
        required: [true, '¡Campo Obligatorio!'],
        validate: {
            validator: (email) => {
                return /\w+@\w+\.+[a-z]/gi.test(email)
            },
            message: '¡Email con formato no valido!'
        }
    },
    password: {
        type: String,
        required: [true, '¡Campo Obligatorio!']
    },
    cuit: {
        type: String,
        unique: true,
        required: [true, "El cuit es necesario"],
    },
    dni: { type: String, unique: true, required: [true, "El dni es necesario"] },
    role: {
        type: String,
        required: true,
        default: "USER_ROLE",
        enum: rolesValidos,
    }
});

usuarioSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

usuarioSchema.methods.comparePassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
};

usuarioSchema.methods.genPass = () => {
    return generate.generate({
        length: 10,
        numbers: true
    })
}

usuarioSchema.methods.validatePass = (password) => {
    const expReg = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/g;
    return expReg.test(password) 
}

usuarioSchema.plugin(uniqueValidator, { message: '¡Ya esta en uso!' });

module.exports = model('usuarios', usuarioSchema);