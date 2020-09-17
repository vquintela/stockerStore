const mongoose = require('mongoose');

const direccion = "mongodb+srv://seminario2:zzauaLfF1wgbPgd4@cluster0.smkha.mongodb.net/seminario2?retryWrites=true&w=majority"

mongoose.connect(direccion, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(db => console.log('DB conectada'))
.catch(err => console.log(err));

