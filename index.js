let express = require('express');
let session = require('express-session');
let MySqlStore = require('express-mysql-session');
let flash = require('connect-flash');
let Db = require('./models/connection');
let fs = require('fs');
let path = require('path');
let bodyParser = require('body-parser');
let routes = require('./routes');
let app = express();
let config = require('config');


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/moocstatic', express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    name: 'Graduation_Project',
    secret: 'Graduation_Project',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 60480000
    },
    store: new MySqlStore({
        schema: {
            tableName: 'sessions',
            columnNames: {
                session_id: 'session_id'
            }
        }
    }, Db.pool('video'))

}));

app.use(flash());

app.use((req, res, next) => {
    res.locals.user = req.session.user;
    res.locals.notification = req.flash('notification').toString();
    next();
});

routes(app);


let port = config.get('port');
console.log('now server listen port ' + port + ' with mode ' + process.env.NODE_ENV);
app.listen(port);