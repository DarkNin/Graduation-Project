let express = require('express');
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

app.locals.notification = '';

routes(app);




app.listen(3307);