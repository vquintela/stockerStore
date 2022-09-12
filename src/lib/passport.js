const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/users')

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({ email: email });
    if (!user) {
        return done(null, false, req.flash('danger', 'Usuario o contraseña no valido'));
    } else {
        const match = await user.comparePassword(password, user.password)
        if (match) {
            return done(null, user, req.flash('message', 'Bienvenido'));
        }        
        return done(null, false, req.flash('danger', 'Usuario o contraseña incorrecta'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id).lean()
    done(null, user);
});