let express = require('express');
let session = require('express-session');
let MySqlStore = require('express-mysql-session');
let Db = require('./models/connection');
let fs = require('fs');
let path = require('path');
let bodyParser = require('body-parser');
let routes = require('./routes');
let app = express();



app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

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


app.use((req, res, next) => {
    req.session.notification = 'asdasdasd';
    res.locals.notification = req.session.notification;
    next();
});
// app.locals.notification = '';

routes(app);




app.listen(3307);