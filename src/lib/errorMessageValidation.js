const errorMessageValidation = {}

errorMessageValidation.crearMensaje = (error) => {
    let errors = {}
    const allErrors = error.message.substring(error.message.indexOf(':')+1).trim();
    const errorsArray = allErrors.split(',').map(err => err.trim())
    errorsArray.forEach(error => {
        const [key, value] = error.split(':').map(err => err.trim())
        errors[key] = value
    })
    return errors
}

module.exports = errorMessageValidation;