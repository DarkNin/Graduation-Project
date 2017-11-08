let express = require('express');
let router = express.Router();

router.get('/', function (req, res) {
    res.render('register', {
        test: 'not test'
    });
});

router.post('/', function (req, res) {
    console.log(req.body.nickname + req.body.password);
    let test = 'testing';
    res.send(test);
});
module.exports = router;