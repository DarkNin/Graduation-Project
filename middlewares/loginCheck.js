module.exports = {
    checkLogin: (req, res, next) => {
        if (!req.session.user) {
            req.flash('notification', '请登录');
            return res.redirect('/login');
        }
        next();
    },

    checkNotLogin: (req, res, next) => {
        if (req.session.user) {
            req.flash('notification', '已登录');
            return res.redirect('back');
        }
        next();
    }
};