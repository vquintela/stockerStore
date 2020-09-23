const nodemailer = require('nodemailer');
const moment = require('moment');

// const direccion = 'mastercarrentalMCR@gmail.com';
// const pass = 'M4st3rc4r';
const direccion = 'eycommerce@dantevaweb.com';
const pass = 'RE=No,5o*&5-';

const transporter = nodemailer.createTransport({
    host: "mail.dantevaweb.com",
    port: 465,
    secure: true, 
    auth: {
        user: direccion,
        pass: pass
    }
})

const mailer = {}

mailer.signup = async (email, nombre, apellido, numberId) => {
    // const link = `https://manejate-app.herokuapp.com/auth/verifica?email=${email}&id=${numberId}`;
    const link = `http://localhost:3000/verifica?email=${email}&id=${numberId}`;
    
    const ret = await transporter.sendMail({
        from: direccion,
        to: email,
        subject: 'MCR Validacion de Email',
        html: `
                <h3><b>Bienvenido a Ey-Commerce</b></h3><br><br>
                <h3><b>¡Gracias por elegirnos:</b>${nombre} ${apellido}</h3><br><br>
                <p>Para terminar con el proceso de registro ingrese al siguiente vinculo</p><br><br><br>
                <br><a href="${link}">Haga click AQUI para verificar</a>
            `
    });
}

mailer.renew = async (email, nombre, apellido, password) => {
    const ret = await transporter.sendMail({
        from: direccion,
        to: email,
        subject: 'Blanqueo de password',
        html: `
                <h3><b>Blanqueo de password</b></h3><br><br>
                <h3><b>Se cambio el password para:</b>${nombre} ${apellido}</h3><br><br>
                <p>¡Recuerde modificar dicha password!</p><br><br><br>
                <p>Su nueva password es: ${password}</p>
            `
    });
}

mailer.contacto = async (mail) => {
    const ret = await transporter.sendMail({
        from: direccion,
        to: mail.email, 
        cc: direccion,
        subject: 'Gracias por contactarse con Ey-Commerce',
        html:`
            <h3><b>Ey-Commerce</b></h3><br><br>
            <h3><b>Gracias por comunicarte con Ey-Commerce, en breve nos pondremos en contacto!</h3><br><br>
            <p>Su mensaje fue:</p><br><br><br>
            <p>Nombre y Apellido: ${mail.nombre}</p><br>
            <p>Motivo de contacto: ${mail.telefono}</p><br>
            <p>Su email: ${mail.email}</p><br>
            <p>Sector Participante: ${mail.sector}</p><br>
            <p>Su comentario: ${mail.comentario}</p><br><br><br>
            <p>Este es un mail generado de forma automatica, no lo responda!</p>
        `
    })
    return ret
}

// mailer.reserva = async (reserva, user, moto, sede) => {
//     moment.locale('es')
//     const ret = await transporter.sendMail({
//         from: direccion,
//         to: user.email,
//         subject: 'Confirmacion de Reserva',
//         html: `
//             <h3><b>Gracias por confiar en MANEJATE</b></h3><br><br>
//             <h3><b>Confirmamos la reserva para:</b>${user.nombre} ${user.apellido}</h3><br><br>
//             <p>¡Recuerde no tomar cuando maneja!</p><br><br><br>
//             <p>Fecha de reserva: ${moment(reserva.fechaReserva).format('l')}</p>
//             <p>Fecha de entrega: ${moment(reserva.fechaEntrega).format('l')}</p>
//             <p>Fecha de devolución: ${moment(reserva.fechaDevolucion).format('l')}</p>
//             <p>Motocicleta: FALTA CONFIGURAR</p>
//             <p>Sede de entrega: FALTA CONFIGURAR</p>
//             <p>Sede de devolución: FALTA CONFIGURAR</p>
//         `
//     });
// }

module.exports = mailer;