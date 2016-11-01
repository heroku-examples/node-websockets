var express = require('express');
var router = express.Router();
var firebase = require("firebase");

var Chat = require('../../models/chat');
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

router.route('/chats/sync_by_fireBase')
    // 全てのチャット一覧を取得 (GET http://localhost:8080/api/chats_sync_by_fireBase)
    .post(function(req, res) {
        var ref = firebase.database().ref('chats');
        ref.once('value').then(function(snapshot) {
            Object.keys(snapshot.val()).forEach(function(key) {
                var user = new Chat(snapshot.val()[key]);
                user.save(function(err) {
                    if (err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                    }
                });
            });
        });
        res.status(resCodes.OK.code).json({ success: true });
    });

router.route('/chats/find')
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

router.route('/chats')
    // 全てのチャット一覧を取得 (GET http://localhost:8080/api/chats)
    .get(function(req, res) {
        User.find(function(err, chats) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
            } else {
                res.status(resCodes.OK.code).json(chats);
            }
        });
    });

router.route('/chats/get-token/:uid')

// チャットの作成 (POST http://localhost:3000/api/chats)
.post(function(req, res) {

    // find the user starlord55
    // update him to starlord 88
    var randtoken = require('rand-token');
    User.findOneAndUpdate({ chatId: req.params.chatId }, { token: randtoken.generate(16) }, function(err, user) {
        if (err)
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
        res.status(resCodes.OK.code).json(user);
    });
});

router.route('/chat')

// セッションチャットの取得 (POST http://localhost:3000/api/chats)
.post(function(req, res) {
    User.findOne({
        chatId: req.params.chatId
    }, function(err, user) {
        if (err) {
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
        } else if (user) {
            res.status(resCodes.OK.code).json(user);
        } else {
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
        }
    });
});

router.route('/chats')

// チャットの作成 (POST http://localhost:3000/api/chats)
.post(function(req, res) {
        User.findOne({
            chatId: req.params.chatId
        }, function(err, user) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
            } else if (user) {
                res.status(resCodes.OK.code).json(user);
            } else {
                // 新しいチャットのモデルを作成する．
                var _chat = new Chat();

                // チャットの各カラムの情報を取得する
                req.session.token = {};
                _chat.uid = req.session.token.uid;
                _chat.save(function(err) {
                        if (err) {
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                        } else {
                            res.status(resCodes.OK.code).json(_chat);
                        }
                    })
                    .catch(function(err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                    });
                // });
            }
        });


    })
    // 1人のチャットの情報を取得 (GET http://localhost:8000/api/chats/:user_id)
    .get(function(req, res) {
        //user_idが一致するデータを探す．
        User.findOne({
            chatId: req.params.chatId
        }, function(err, user) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
            } else {
                res.status(resCodes.OK.code).json(user);
            }
        });
    })
    // 1人のチャットの情報を更新 (PUT http://localhost:8000/api/chats/:user_id)
    .put(function(req, res) {
        console.log("req.session.token", req.session.token)
        User.findOne({
            chatId: req.params.chatId
        }, function(err, user) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
            } else {

                chat.chatId = req.body.chatId;
                chat.uid = req.body.
                chat.title = req.body.
                chat.isDebug = req.body.

                chat.save(function(err) {
                    if (err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                    } else {
                        res.status(resCodes.OK.code).json(chat);
                    }
                });
            }
        });
    })

// 1人のチャットの情報を削除 (DELETE http://localhost:8000/api/chats/:uid)
.delete(function(req, res) {
    Chat.remove({
        chatId: req.params.chatId
    }, function(err, user) {
        if (err) {
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
        } else {
            res.status(resCodes.OK.code).json({
                message: 'Successfully deleted!'
            });
        }
    });
});

// ルーティング登録
module.exports = router;
