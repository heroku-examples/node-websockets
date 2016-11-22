var express = require('express');
var router = express.Router();
var firebase = require("firebase");

var PrivateChat = require('../../models/private_chat');
var resCodes = require('../.././json/http/http_code_names.json');

//before filter
router.use(function(req, res, next) {
    if (process.env.NODE_ENV != 'production') {
        next();
    } else if (req.session.token) {
        next();
    } else {
        //Return a response immediately
        res.status(resCodes.UNAUTHORIZED.code).json();
    }
});

router.route('/privateChats/find')
    // 条件指定で対象チャット一覧を取得 (GET http://localhost:8080/api/chats/find)
    .post(function(req, res) {
        User.find(req.body, function(err, chats) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
            } else {
                res.status(resCodes.OK.code).json(chats);
            }
        });
    });


// ルーティング登録
module.exports = router;
