let express = require('express');
let router = express.Router();
let Db = require('../models/connection');
let sha1 = require('../middlewares/cryptoUtil.js').sha1;
let check = require('../middlewares/loginCheck');

router.get('/', check.checkNotLogin, (req, res) => {
    res.render('login');
});

router.post('/', (req, res, next) => {
    let user = {
        name: req.body.nickname,
        password: req.body.password
    };
    Db.findAccount(user).then(
        (arg) => {
            if (arg[0]) {
                let pwdTemp = sha1(user.password + ':' +arg[0].timeStamp);
                if (pwdTemp === arg[0].password) {
                    req.session.user = {
                        id: arg[0].id,
                        name: arg[0].name
                    }
                } else {
                    req.flash('notification', '密码错误');
                    res.redirect('login');
                }
            } else {
                req.flash('notification', '用户不存在');
                res.redirect('login');
            }
        }
    ).catch((err) => {
        console.log('find error:' + err);
        next(err);
    })
});

module.exports = router;