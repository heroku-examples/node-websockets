var express = require('express');
var router = express.Router();

var Config = require('../../models/config');
var resCodes = require('../.././json/http/http_code_names.json');

var pageConfig = {
    page: 1,
    limit: 50
};

//before filter
router.use(function(req, res, next) {
    if (process.env.NODE_ENV != 'production') {
        next();
    } else if (req.session.token && req.session.isDebug) {
        next();
    } else {
        //Return a response immediately
        res.status(resCodes.UNAUTHORIZED.code).json();
    }
});

router.route('/webPush')
    // セッションチャットの取得 (POST http://localhost:3000/api/push)
    .post(function (req, res) {
        var FireBaseSearvice = require('../../services/firebase');
        FireBaseSearvice.webPush(req, req.body.registrationIds).then(function (comment) {
            res.status(resCodes.OK.code).json({ comment: comment });
        }, function (err) {
            console.log('err', err, err.lineNumber);
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        });
    })
// ルーティング登録
module.exports = router;
