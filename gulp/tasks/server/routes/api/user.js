var express = require('express');
var router = express.Router();
var firebase = require("firebase");

var User = require('../../models/user');
var resCodes = require('../.././json/http/http_code_names.json');

//before filter
router.use(function(req, res, next) {
    if (process.env.NODE_ENV != 'production') {
        next();
    } else if (req.originalUrl == '/api/token/check') {
        next();
    } else if (req.session.token) {
        next();
    } else {
        //Return a response immediately
        res.status(resCodes.BAD_REQUEST.code).json({ message: resCodes.BAD_REQUEST.phrase });
    }
});

router.route('/users/sync_by_fireBase')
    // 全てのユーザ一覧を取得 (GET http://localhost:8080/api/users_sync_by_fireBase)
    .post(function(req, res) {
        var ref = firebase.database().ref('users');
        ref.once('value').then(function(snapshot) {
            Object.keys(snapshot.val()).forEach(function(key) {
                var user = new User(snapshot.val()[key]);
                user.save(function(err) {
                    if (err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    }
                });
            });
        });
        res.status(resCodes.OK.code).json({ success: true });
    });

router.route('/users/find')
    // 条件指定で対象ユーザ一覧を取得 (GET http://localhost:8080/api/users/find)
    .post(function(req, res) {
        User.find(req.body, function(err, users) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(users);
            }
        });
    });

router.route('/users')
    // 全てのユーザ一覧を取得 (GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(users);
            }
        });
    });

router.route('/users/get-token/:uid')

// ユーザの作成 (POST http://localhost:3000/api/users)
.post(function(req, res) {

    // find the user starlord55
    // update him to starlord 88
    var randtoken = require('rand-token');
    User.findOneAndUpdate({ uid: req.params.uid }, { token: randtoken.generate(16) }, function(err, user) {
        if (err)
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        res.status(resCodes.OK.code).json(user);
    });
});


router.route('/users')

// ユーザの作成 (POST http://localhost:3000/api/users)
.post(function(req, res) {
    console.log(req.session)
        if(!req.session.token){
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json({message: 'error'});
            return;
        }
        User.findOne({
            uid: req.session.token.uid
        }, function(err, user) {
            console.log(err, user)
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                return;
            }else if (user) {
                res.status(resCodes.IM_USED.code).json(user);
                return;
            }
            // 新しいユーザのモデルを作成する．
            var _user = new User();

            // ユーザの各カラムの情報を取得する
            req.session.token = {};
            _user.uid = req.session.token.uid;
            _user.name = req.body.name;
            _user.age = req.body.age;
            _user.createDate = new Date();

            // var ref = firebase.database().ref('users/' + req.session.token.uid);
            // ref.set({
            //     "uid": req.session.token.uid,
            //     "name": req.body.name,
            //     "age": req.body.age,
            //     "createDate": new Date()
            // }).then(function() {
                _user.save(function(err) {
                        if (err) {
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                        } else {
                            res.status(resCodes.OK.code).json(_user);
                        }
                    })
                    .catch(function(error) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    });
            // });
        });


    })
    // 1人のユーザの情報を取得 (GET http://localhost:8000/api/users/:user_id)
    .get(function(req, res) {
        //user_idが一致するデータを探す．
        User.find({
            uid: req.params.uid
        }, function(err, user) {
            if (err)
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            res.status(resCodes.OK.code).json(user);
        });
    })
    // 1人のユーザの情報を更新 (PUT http://localhost:8000/api/users/:user_id)
    .put(function(req, res) {
        User.findOne({
            uid: req.session.token.uid
        }, function(err, user) {
            if (err)
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            // ユーザの各カラムの情報を更新する．
            user.name = req.body.name;
            user.age = req.body.age;

            user.update(function(err) {
                if (err)
                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                res.status(resCodes.OK.code).json({
                    message: 'User updated!'
                });
            });
        });
    })

// 1人のユーザの情報を削除 (DELETE http://localhost:8000/api/users/:uid)
.delete(function(req, res) {
    User.remove({
        uid: req.params.uid
    }, function(err, user) {
        if (err)
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        res.status(resCodes.OK.code).json({
            message: 'Successfully deleted'
        });
    });
});

// ルーティング登録
module.exports = router;
