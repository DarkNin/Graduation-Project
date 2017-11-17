let express = require('express');
let router = express.Router();
let check = require('../middlewares/loginCheck');
router.get('/', check.checkLogin, (req, res) => {
        req.session.user = null;
        req.flash('notification', '成功登出');
        res.redirect('video');
    }
);

module.exports = router;