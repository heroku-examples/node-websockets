var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    // トークンとエントリ済みがセッションに保存されていた場合のみアクセス可能
    if (req.url == "/redirect") {
        next();
    } else if (req.session.token && !req.session.isEntry) {
        next();
    } else {
        //Return a response immediately
        res.redirect("../index");
    }
    var config = require('./../services/config');
    config.get('deviceCacheKey').then(function(records) {
        res.locals.deviceCacheKey = records.results;
    }, function(error) {
        console.log("Rejected:", error.message);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main', {
        message: 'main',
        session: req.session
    });
});

router.get('/redirect', function(req, res, next) {
    res.render('main', {
        message: 'main',
        session: req.session
    });
});

module.exports = router;
