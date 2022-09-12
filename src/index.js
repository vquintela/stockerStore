const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const multer = require('multer');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

const port = '3010';

const app = express();
require('./lib/database');
require('./lib/passport');

//Settings
app.set('port', process.env.PORT || port);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}))
app.set('view engine', '.hbs');
app.use(multer({dest: path.join(__dirname, 'public/img')}).single('imagen'));

//Midlewares
app.use(session({
    secret: 'eycommerce',
    resave: false,
    saveUninitialized: false,
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req, res, next) => {
    app.locals.session = req.session;
    app.locals.user = req.user;
    app.locals.success = req.flash('success');
    app.locals.danger = req.flash('danger');
    next();
});

// Routes
app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use('/users', require('./routes/user'));
app.use('/productos', require('./routes/producto'));
app.use('/carrito', require('./routes/carrito'));
app.use('/venta', require('./routes/venta'));
app.use('/dashboard', require('./routes/dashboard'));


//Archivos Publicos
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar Servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor en puerto ${app.get('port')}`)
})