var express = require('express');
var router = express.Router();
var apiai = require('apiai');

var apiApp = apiai("2da7378c9dd148ccbb56e6cd10e3f93b");


var resCodes = require('../.././json/error/error_code_names.json');

router.route('/say')

.post(function(req, res) {
    var request = apiApp.textRequest('test');
    request.on('response', function(response) {
        res.status(resCodes.OK.code).json(response);
    });
     
    request.on('error', function(error) {
        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(error);
    });

    request.end();
});

router.route('/say/1')

.post(function(req, res) {
    var request = apiApp.textRequest('aaaaa');
    request.on('response', function(response) {
        res.status(resCodes.OK.code).json(response);
    });
     
    request.on('error', function(error) {
        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(error);
    });

    request.end();
});

// ルーティング登録
module.exports = router;
