var express = require('express');
var router = express.Router();

var Token = require('../../models/token');
var User = require('../../models/user');

var resCodes = require('../.././json/http/http_code_names.json');

router.route('/token/check')

// 作成 (POST http://localhost:3000/api/users)
.post(function(req, res) {
    var firebase = require("firebase");
    if (req.session.token) {
        res.status(resCodes.OK.code).json(req.session.token);
    } else {
        firebase.auth().verifyIdToken(req.body.token).then(function(decodedToken) {
            User.findOne({
                uid: decodedToken.uid
            }, function(err, user) {
                if (err) {
                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                } else if (user) {
                    Token.findOne({
                        uid: decodedToken.uid
                    }, function(err, token) {
                        token.uid = decodedToken.uid;
                        token.token = req.body.token;
                        token.isDebug = token.isDebug;
                        if (err) res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                        token.token = req.body.token;
                        token.save(function(err) {
                            if (err){
                                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                            }else{
                                req.session.token = token;
                                req.session.isEntry = user.isEntry;
                                req.session.isDebug = user.isDebug;
                                res.status(resCodes.OK.code).json(token);
                            }
                        });
                    });
                } else {
                    var token = new Token();
                    token.uid = decodedToken.uid;
                    token.token = req.body.token;
                    token.save(function(err) {
                        if (err) {
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                        } else {
                            var _user = new User();
                            _user.uid = decodedToken.uid;
                            _user.name = "name";
                            _user.age = 0;
                            _user.createDate = new Date();
                            _user.save(function(err) {
                                    if (err) {
                                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                                    } else {
                                        req.session.token = decodedToken;
                                        res.status(resCodes.OK.code).json(token);
                                    }
                                })
                                .catch(function(err) {
                                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({ error: err });
                                });
                        }
                    });
                }
            });
        }).catch(function(error) {
            res.status(resCodes.OINTERNAL_SERVER_ERRORK.code).json(error);
        });
    }

})
// 1人のユーザのセッションを削除 (DELETE http://localhost:8000/api/users/:uid)
.delete(function(req, res) {
    req.session.token = false;
    req.session.isEntry = true;
    req.session.isDebug = false;
    res.status(resCodes.OK.code).json({
        message: 'Successfully deleted!'
    });
});

// ルーティング登録
module.exports = router;
