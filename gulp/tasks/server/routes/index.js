var express = require('express');
var router = express.Router();

var User       = require('../models/user');
var resCodes = require('.././json/http/http_code_names.json');

router.use(function(req, res, next) {
if (req.session.token) {
        next();
    } else {
        //Return a response immediately
        res.redirect("../main");
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
      message:'index'
    });
});

module.exports = router;
