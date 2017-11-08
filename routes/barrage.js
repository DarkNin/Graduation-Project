let express = require('express');
let router = express.Router();
let Db = require('../models/connection.js');

router.get('/', (req, res) => {
    res.render('main');
});




router.get('/barrage_server/default', function (req, res) {
    //console.log(req.originalUrl);
    let array = Db.selectMsg(req.query.time);
    array.then((arg) => {
        res.send(arg);
    });

});
router.post('/barrage_server', function (req, res) {

    let obj = {
        content: req.body.content,
        time: req.body.time,
        type: req.body.type,
        color: req.body.color,
        date: req.body.date,
        user: req.body.user,
        x: req.body.x,
        y: req.body.y,
        vx: req.body.vx
    };
    res.send(obj);
    Db.insertMsg(obj);
});

module.exports = router;