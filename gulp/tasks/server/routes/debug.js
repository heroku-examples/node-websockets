var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
    if (req.session.token && req.session.isDebug) {
        next();
    } else {
        //Return a response immediately
        res.redirect("../main");
    }
    var Config = require('./../services/config');
    Config.get('deviceCacheKey').then(function(records) {
        res.locals.deviceCacheKey = records.results;
    }, function(error) {
        console.log("Rejected:", error.message);
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('debug', {
        message: 'debug',
        session: req.session
    });
});

module.exports = router;
