var express = require('express');
var router = express.Router();
var firebase = require("firebase");

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/jsonAPI');
var User = require('../../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json({
        title: 'User'
    });
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
                res.send(err);
            }
            });
        });
    });
    res.status(200).json({success :true});
});

router.route('/users/find')
// 条件指定で対象ユーザ一覧を取得 (GET http://localhost:8080/api/users/find)
.post(function(req, res) {
    User.find(req.body, function(err, users) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(users);
        }
    });
});

router.route('/users')
// 全てのユーザ一覧を取得 (GET http://localhost:8080/api/users)
.get(function(req, res) {
    User.find(function(err, users) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json(users);
        }
    });
});

router.route('/users/:uid')

// ユーザの作成 (POST http://localhost:3000/api/users)
.post(function(req, res) {

    // 新しいユーザのモデルを作成する．
    var user = new User();

    // ユーザの各カラムの情報を取得する．
    user.uid = req.body.uid;
    user.name = req.body.name;
    user.age = req.body.age;

    // ユーザ情報をセーブする．
    user.save(function(err) {
        if (err) {
            res.send(err);
        } else {
            res.status(200).json({
                message: 'User created!'
            });
        }
    });
})
// 1人のユーザの情報を取得 (GET http://localhost:8000/api/users/:user_id)
.get(function(req, res) {
    //user_idが一致するデータを探す．
    User.find({
        uid: req.params.uid
    }, function(err, user) {
        if (err)
            res.send(err);
        res.json(user);
    });
})
// 1人のユーザの情報を更新 (PUT http://localhost:8000/api/users/:user_id)
.put(function(req, res) {
    User.find({
        uid: req.params.uid
    }, function(err, user) {
        if (err)
            res.send(err);
        // ユーザの各カラムの情報を更新する．
        user.uid = req.body.uid;
        user.name = req.body.name;
        user.age = req.body.age;

        user.save(function(err) {
            if (err)
                res.send(err);
            res.json({
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
            res.send(err);
        res.json({
            message: 'Successfully deleted'
        });
    });
});

// ルーティング登録
module.exports = router;