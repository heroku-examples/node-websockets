var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main', {
      message:'main'
    });
});

module.exports = router;
