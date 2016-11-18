var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
    // トークンとエントリ済みがセッションに保存されていた場合のみアクセス可能
    if (req.session.token && !req.session.isEntry) {
        next();
    } else {
        //Return a response immediately
        res.redirect("../main/redirect");
    }

});

/* GET home page. */
router.get('/', function (req, res, next) {
    var Config = require('./../services/config');
    Config.get('deviceCacheKey').then(function (records) {
        res.locals.deviceCacheKey = records.number;
        var User = require('./../services/user');



        User.getFriends(req).then(function (friends) {
            req.session.userInfos = friends;
            User.getRecommends(req).then(function (recommendUsers) {
                res.render('index', {
                    useragent: req.useragent,
                    recommendUsers: recommendUsers,
                    userInfos: req.session.userInfos,
                    requestInfos: req.session.requestInfos ? req.session.requestInfos : {},
                    message: 'index',
                    session: req.session,
                    env: process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
                });
            }, function (error) {
                console.log("Rejected:", error.message);
            });
        }, function (error) {
            console.log("Rejected:", error.message);
        });


    }, function (error) {
        console.log("Rejected:", error);
    });

});

module.exports = router;
