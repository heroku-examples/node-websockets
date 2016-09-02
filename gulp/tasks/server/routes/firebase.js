var express = require('express');
var router = express.Router();

var firebase = require("firebase");
var pkg = require('../../../.././package.json');


firebase.initializeApp({
    serviceAccount: "./www/json/firebase/squareGame-8ad71595b440.json",
    databaseURL: "https://project-3597707734440258770.firebaseio.com"
});

var uid = "zcMTtpFeKEhmGPiJWno0310Sv5p1";
var additionalClaims = {
    premiumAccount: true
};
var token = firebase.auth().createCustomToken(uid, additionalClaims);
firebase.auth().verifyIdToken(token).catch(function(error) {
  var errorCode = error.code;
  var errorMessage = error.message;
});


/* GET home page. */
router.get('/', function(req, res, next) {
    res.status(200).json({ token: token });
});

router.route('/users')
// 全てのユーザ一覧を取得 (GET http://localhost:8080/firebase/users)
    .get(function(req, res) {
        var ref = firebase.database().ref('users');
        ref.once('value').then(function(snapshot) {
            console.log(snapshot.val()[0])
          res.send(snapshot.val());
        });
    });

router.route('/users/:uid')

// ユーザの作成 (POST http://localhost:3000/api/users)
    .post(function(req, res) {

        // // 新しいユーザのモデルを作成する．
        // var user = new User();

        // // ユーザの各カラムの情報を取得する．
        // user.uid = req.body.uid;
        // user.name = req.body.name;
        // user.age = req.body.age;

        // // ユーザ情報をセーブする．
        // user.save(function(err) {
        //     if (err) {
        //         res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
        //     }else{
        //         res.status(200).json({ message: 'User created!' });
        //     }
        // });
    })
// 1人のユーザの情報を取得 (GET http://localhost:3000/api/users/:user_id)
    .get(function(req, res) {
        // //user_idが一致するデータを探す．
        // User.find({uid :req.params.uid}, function(err, user) {
        //     if (err)
        //         res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
        //     res.json(user);
        // });
    })
// 1人のユーザの情報を更新 (PUT http://localhost:3000/api/users/:user_id)
    .put(function(req, res) {
        // User.find({uid :req.params.uid}, function(err, user) {
        //     if (err)
        //         res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
        //     // ユーザの各カラムの情報を更新する．
        //     user.uid = req.body.uid;
        //     user.name = req.body.name;
        //     user.age = req.body.age;

        //     user.save(function(err) {
        //         if (err)
        //             res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
        //         res.json({ message: 'User updated!' });
        //     });
        // });
    })

// 1人のユーザの情報を削除 (DELETE http://localhost:3000/api/users/:uid)
    .delete(function(req, res) {
        // User.remove({
        //     uid: req.params.uid
        // }, function(err, user) {
        //     if (err)
        //         res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
        //     res.json({ message: 'Successfully deleted' });
        // });
    });

// ルーティング登録
module.exports = router;
