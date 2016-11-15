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
    if (req.session.token && req.session.isDebug) {
        setConfig(req, res, next);
    } else {
        //Return a response immediately
        res.redirect("../main");
    }
    var Config = require('./../services/config');
    Config.get('deviceCacheKey').then(function(records) {
        res.locals.deviceCacheKey = records.number;
    }, function(error) {
        console.log("Rejected:", error);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('debug', {
        message: 'debug',
        session: req.session,
        env: process.env.NODE_ENV ? process.env.NODE_ENV : 'development'
    });
});

module.exports = router;
