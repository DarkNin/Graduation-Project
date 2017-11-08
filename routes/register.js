let express = require('express');
let router = express.Router();
let Db = require('../models/connection.js');
let sha1 = require('../middlewares/cryptoUtil.js').sha1;

router.get('/', (req, res) => {
    res.render('register', {
        notification: '1'
    })
});

router.post('/', (req, res) => {
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
        let notification = e.message;
        return res.render('register', {
            notification: notification
        });
        //return res.redirect('/register');
    }

    let date = new Date();
    let timeStamp = date.getTime();
    password = sha1(password +':' + timeStamp);
    let usr = {
        date: date.toDateString(),
        name: name,
        password: password,
        timeStamp: timeStamp
    };
    Db.findAccount(usr).then(
        (arg) => {
            if (!arg[0]) {
                Db.createAccount(usr).then(
                    (arg) => {
                        console.log(arg);
                    }

                ).catch((err) => {
                    console.log('create error:' + err);
                })
            } else {
                let notification = '该id已被占用';
                return res.render('register', {
                    notification: notification
                });
            }
        }
    ).catch((err) => {
            console.log('find error:' + err);
        }
    )
    // Db.createAccount(usr).then(
    //     (arg) => {
    //         console.log(arg);
    //     }
    // ).catch((err) => {
    //     console.log(err);
    // })

});


module.exports = router;