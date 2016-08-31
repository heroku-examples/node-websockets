var express = require('express');
var router = express.Router();

var mongoose   = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/jsonAPI');
var User       = require('../models/user');


/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json({ title: 'Express' });
});

router.route('/users')
// ユーザの作成 (POST http://localhost:3000/api/users)
    .post(function(req, res) {

        // 新しいユーザのモデルを作成する．
        var user = new User();

        // ユーザの各カラムの情報を取得する．
        user.twitter_id = req.body.twitter_id;
        user.name = req.body.name;
        user.age = req.body.age;

        // ユーザ情報をセーブする．
        user.save(function(err) {
            if (err)
                res.send(err);
            res.status(200).json({ message: 'User created!' });
        });
    })

// 全てのユーザ一覧を取得 (GET http://localhost:8080/api/users)
    .get(function(req, res) {
        User.find(function(err, users) {
            if (err)
                res.send(err);
            res.status(200).json(users);
        });
    });

module.exports = router;
