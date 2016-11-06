var express = require('express');
var router = express.Router();
var firebase = require("firebase");

var resCodes = require('../.././json/http/http_code_names.json');

//before filter
router.use(function (req, res, next) {
    if (process.env.NODE_ENV != 'production') {
        req.session.token = {};
        req.session.token.uid = 'zcMTtpFeKEhmGPiJWno0310Sv5p1';
        var Token = require('../../models/token');
        Token.findOne({
            uid: req.session.token.uid
        }, function (err, token) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else if (token) {
                req.session.token.token = token.token;
                next();
            } else{
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json();
            }
        });
    } else if (req.session.token) {
        next();
    } else {
        //Return a response immediately
        res.status(resCodes.UNAUTHORIZED.code).json();
    }
});

router.route('/chat')
    // セッションチャットの取得 (POST http://localhost:3000/api/chats)
    .post(function (req, res) {
        var FireBaseSearvice = require('../../services/firebase');
        FireBaseSearvice.sendFriendChatComment(req, req.body.url, req.body.text, req.body.photoURL).then(function (commentResult) {

            var text = 'message from :' + req.session.token.uid;
            FireBaseSearvice.sendNotify(req, text, req.session.token.uid, req.body.targetUid, req.body.photoURL).then(function (notifyResult) {
                res.status(resCodes.OK.code).json({ commentResult: commentResult, notifyResult: notifyResult });
            }, function (err) {
                console.log('err', err, err.lineNumber);
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            });

        }, function (err) {
            console.log('err', err, err.lineNumber);
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        });
    });

// ルーティング登録
module.exports = router;
