var express = require('express');
var router = express.Router();

var User       = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
    User.find(function(err, users) {
        if (err)
            res.send(err);
        res.render('index', {
          message: JSON.stringify(users)
        });
    });

});

module.exports = router;
