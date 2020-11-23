module.exports = {
    logueado(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/');
    },

    noLogueado(req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/profile');
    },

    logAdmin(req, res, next) {
        if(req.isAuthenticated() && req.user.rol === 'administrador') {
            return next();
        }
        return res.redirect('/');
    }
};