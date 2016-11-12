var express = require('express');
var router = express.Router();

var Config = require('../../models/config');
var resCodes = require('../.././json/http/http_code_names.json');

var pageConfig = {
    page: 1,
    limit: 50
};

//before filter
router.use(function (req, res, next) {
    if (process.env.NODE_ENV != 'production') {
        if (!req.session.token) {
            req.session.token = {};
            req.session.token.uid = 'zcMTtpFeKEhmGPiJWno0310Sv5p1';
        }
        next();
    } else if (req.session.token) {
        next();
    } else {
        //Return a response immediately
        res.status(resCodes.UNAUTHORIZED.code).json();
    }
});
router.route('/webPush')
    // セッションチャットの取得 (POST http://localhost:3000/api/push)
    .post(function (req, res) {
        var p256dh = req.body.p256dh;
        var auth = req.body.auth;
        var registrationIds = req.body.registrationIds;
        var endpoint = req.body.endpoint;
        var FireBaseSearvice = require('../../services/firebase');
        var text = req.session.token.uid;
        FireBaseSearvice.webPush2(req, endpoint, auth, p256dh, text, false).then(function (comment) {
            res.status(resCodes.OK.code).json({ comment: comment });
        }, function (err) {
            console.log('err', err, err.lineNumber);
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        });
    });

router.route('/webPush/friend')
    // セッションチャットの取得 (POST http://localhost:3000/api/push)
    .post(function (req, res) {

        var FireBaseSearvice = require('../../services/firebase');
        var text = req.session.token.uid;
        FireBaseSearvice.webPushToFriend(req, req.body.uid, text).then(function (comment) {
            res.status(resCodes.OK.code).json({ comment: comment });
        }, function (err) {
            console.log('err', err, err.lineNumber);
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        });

    })
// ルーティング登録
module.exports = router;
