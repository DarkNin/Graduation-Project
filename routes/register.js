let express = require('express');
let router = express.Router();
let Db = require('../models/connection.js');
let sha1 = require('../middlewares/cryptoUtil.js').sha1;
let check = require('../middlewares/loginCheck');

router.get('/', check.checkNotLogin, (req, res) => {
    res.render('register')
});

router.post('/', (req, res, next) => {
    let name = req.body.nickname;
    let password = req.body.password;
    let __password = req.body._password;
    try {
        if (!(name && password && __password)) {
            throw new Error('请填写完整信息');
        } else if (name.length > 10) {
            throw new Error('昵称请限制在10个字符以内');
        } else if (password.length < 6) {
            throw new Error('密码至少6位');
        } else if (password !== __password) {
            throw new Error('两次输入密码不一致');
        }

    } catch (e) {
        req.flash('notification', e.message);
        return res.redirect('/register');
    }

    let date = new Date();
    let timeStamp = date.getTime();
    password = sha1(password + ':' + timeStamp);
    let usr = {
        date: date.toDateString(),
        name: name,
        password: password,
        timeStamp: timeStamp
    };
    Db.findAccount(usr).then(
        (arg) => {
            console.log('find:' + JSON.stringify(arg));
            if (!arg[0]) {
                Db.createAccount(usr).then(
                    (arg) => {
                        req.session.user = {
                            id: arg[0].insertId,
                            name: usr.name
                        };

                    }
                ).catch((err) => {
                    console.log('create error:' + err);
                })
            } else {
                req.flash('notification', '该id已被占用');
                return res.redirect('/register');
            }
        }
    ).catch((err) => {
            console.log('find error:' + err);
            next(err);
        }
    )
});


module.exports = router;