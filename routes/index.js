
module.exports = function (app) {
    app.use('/test', require('./test'));
    app.use('/video', require('./barrage'));
    app.use('/register', require('./register'));
};