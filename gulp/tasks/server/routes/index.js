var express = require('express');
var router = express.Router();

var User       = require('../models/user');
var resCodes = require('.././json/http/http_code_names.json');

router.use(function(req, res, next) {
// トークンとエントリ済みがセッションに保存されていた場合のみアクセス可能
if (req.session.token && !req.session.isEntry) {
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
