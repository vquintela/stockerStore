const { Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');
const generate = require('generate-password');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
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
    rol: {
        type: String,
        enum: {
            values: ['cliente', 'operador' ,'administrador'],
            message: '¡Debe elegir un rol!'
        },
        default: 'cliente'
    },
    numAut: String,
    estado: {
        type: Boolean,
        default: false,
        required: true
    }
});

userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

userSchema.methods.comparePassword = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
};

userSchema.methods.genPass = () => {
    return generate.generate({
        length: 10,
        numbers: true
    })
}

userSchema.methods.validatePass = (password) => {
    const expReg = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/g;
    return expReg.test(password) 
}

userSchema.plugin(uniqueValidator, { message: '¡Email en uso elija otro!' });

module.exports = model('user', userSchema);