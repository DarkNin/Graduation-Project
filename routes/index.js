
module.exports = function (app) {
    app.use('/test', require('./test'));
    app.use('/main', require('./mainpage'));
    app.use('/register', require('./register'));
    app.use('/login', require('./login'));
    app.use('/logout', require('./logout'));
    app.use('/checkpage', require('./checkpage'));
};