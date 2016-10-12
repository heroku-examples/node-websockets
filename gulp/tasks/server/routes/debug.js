var express = require('express');
var router = express.Router();

router.use(function(req, res, next) {
if (req.session.token && req.session.isDebug) {
        next();
    } else {
        //Return a response immediately
        res.redirect("../main");
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('debug', {
      message:'debug'
    });
});

module.exports = router;
