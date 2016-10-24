var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    // トークンとエントリ済みがセッションに保存されていた場合のみアクセス可能
    if (req.session.token && !req.session.isEntry) {
        next();
    } else {
        //Return a response immediately
        res.redirect("../main/redirect");
    }

});

/* GET home page. */
router.get('/', function(req, res, next) {
    var Config = require('./../services/config');
    Config.get('deviceCacheKey').then(function(records) {
        res.locals.deviceCacheKey = records.number;
        var User = require('./../services/user');
        User.getRecommends(req).then(function(records) {
            res.render('index', {
                users: records,
                message: 'index',
                session: req.session
            });
        }, function(error) {
            console.log("Rejected:", error.message);
        });
    }, function(error) {
        console.log("Rejected:", error);
    });

});

module.exports = router;
