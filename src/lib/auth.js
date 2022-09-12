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
        return res.redirect('/dashboard');
    },

    logAdmin(req, res, next) {
        if(req.isAuthenticated() && req.user.role === 'ADMIN_ROLE') {
            return next();
        }
        return res.redirect('/');
    }
};