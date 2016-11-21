var express = require('express');
var router = express.Router();

var Identification = require('../../models/identification');
var User = require('../../models/user');
var Debug = require('../../models/debug');

var resCodes = require('../.././json/http/http_code_names.json');

router.route('/token')

    // 作成 (POST http://localhost:3000/api/users)
    .post(function (req, res) {
        var firebase = require("firebase");

        var setView = function (identification, user){
            res.status(resCodes.OK.code).json({
                identification : identification,
                user : user
            });
        }
        // if (req.session.token) {
        //     res.status(resCodes.OK.code).json(req.session.token);
        // } else {
        req.session.token = false;
        firebase.auth().verifyIdToken(req.body.token).then(function (decodedToken) {
            if (typeof decodedToken != 'object') res.status(resCodes.UNAUTHORIZED.code).json();
            if (!decodedToken.uid) res.status(resCodes.UNAUTHORIZED.code).json();
            User.findOne({
                uid: decodedToken.uid
            }, function (err, user) {
                if (err) {
                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                } else if (user) {
                    Identification.findOne({
                        uid: decodedToken.uid
                    }, function (err, identification) {
                        if (err) {
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                        } else if (!identification) {
                            var identification = new Identification();
                            identification.uid = decodedToken.uid;
                            identification.token = req.body.token;
                            identification.save(function (err) {
                                if (err) {
                                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                                } else {
                                    setView(identification, user);
                                }
                            });
                        } else {
                            identification.uid = decodedToken.uid;
                            identification.token = req.body.token;
                            identification.save(function (err) {
                                if (err) {
                                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                                } else {
                                    req.session.token = identification;
                                    req.session.isEntry = user.isEntry;
                                    Debug.findOne({
                                        uid: decodedToken.uid
                                    }, function (err, debug) {
                                        if(err){
                                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                                        }else if (debug) {
                                            if (!debug.delFlag) req.session.isDebug = true;
                                            identification.isDebug = true;
                                        }
                                        setView(identification, user);
                                    });
                                }
                            });
                        }

                    });
                } else {
                    var identification = new Identification();
                    identification.uid = decodedToken.uid;
                    identification.token = req.body.token;
                    identification.save(function (err) {
                        if (err) {
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                        } else {
                            var _user = new User();
                            _user.uid = decodedToken.uid;
                            _user.name = "name";
                            _user.age = 0;
                            _user.save(function (err) {
                                if (err) {
                                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                                } else {
                                    req.session.token = decodedToken;
                                    res.status(resCodes.OK.code).json(identification);
                                }
                            })
                                .catch(function (err) {
                                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                                });
                        }
                    });
                }
            });
        }).catch(function (err) {
            res.status(resCodes.OINTERNAL_SERVER_ERROR.code).json(err);
        });
        // }

    })
    // 1人のユーザのセッションを削除 (DELETE http://localhost:8000/api/users/:uid)
    .delete(function (req, res) {
        req.session.token = false;
        req.session.isEntry = true;
        req.session.isDebug = false;
        res.status(resCodes.OK.code).json({
            message: 'Successfully deleted!'
        });
    });

// ルーティング登録
module.exports = router;
