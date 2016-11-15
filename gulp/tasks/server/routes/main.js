var express = require('express');
var router = express.Router();

var setConfig = function(req, res, next){
    var Config = require('./../services/config');
    Config.get('deviceCacheKey').then(function(records) {
        res.locals.deviceCacheKey = records.number;
        next();
    }, function(error) {
        console.log("Rejected:", error);
    });
};

router.use(function(req, res, next) {
    // トークンとエントリ済みがセッションに保存されていた場合のみアクセス可能
    if (req.url == "/redirect" || req.url == "/") {
        setConfig(req, res, next);
    } else if (req.session.token && !req.session.isEntry) {
        setConfig(req, res, next);
    } else {
        //Return a response immediately
        res.redirect("../index");
    }

});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main', {
        message: 'main',
        session: req.session,
        env : process.env.NODE_ENV
    });
});

router.get('/redirect', function(req, res, next) {
    res.render('main', {
        message: 'main',
        session: req.session,
        env : process.env.NODE_ENV
    });
});

module.exports = router;
