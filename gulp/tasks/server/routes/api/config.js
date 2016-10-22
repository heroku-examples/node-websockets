var express = require('express');
var router = express.Router();

var Config = require('../../models/config');
var resCodes = require('../.././json/http/http_code_names.json');


//before filter
router.use(function(req, res, next) {
    if (process.env.NODE_ENV != 'production') {
        next();
    } else if (req.session.token && req.session.isDebug) {
        next();
    } else {
        //Return a response immediately
        res.status(resCodes.BAD_REQUEST.code).json({ message: resCodes.BAD_REQUEST.phrase });
    }
});

router.route('/config')
    // 一つのコンフィグの情報を取得 (GET http://localhost:8000/api/configs/:config_id)
    .get(function(req, res) {
        //config_idが一致するデータを探す．
        Config.find({
            name: req.params.name
        }, function(err, config) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(config);
            }
        });
    });

router.route('/configs')
    // 全てのコンフィグ一覧を取得 (GET http://localhost:8080/api/configs)
    .get(function(req, res) {
        var page = req.query.page ? req.query.page : pageConfig.page;
        var limit = req.query.limit ? req.query.limit : pageConfig.limit;
        Config.paginate({}, { page: page, limit: limit }, function(err, result) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(result);
            }
        });
    })

    // コンフィグの作成 (POST http://localhost:3000/api/configs)
    .post(function(req, res) {
        Config.findOne({
            name: req.body.name
        }, function(err, config) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else if (config) {
                res.status(resCodes.CONFLICT.code).json(config);
            } else {
                // 新しいコンフィグのモデルを作成する．
                var _config = new User();

                // コンフィグの各カラムの情報を取得する
                req.session.token = {};
                _config.name = req.body.name;
                _config.values = req.body.values;
                _config.save(function(err) {
                        if (err) {
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                        } else {
                            res.status(resCodes.OK.code).json(_config);
                        }
                    })
                    .catch(function(err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    });
                // });
            }
        });


    })

    // 一つのコンフィグの情報を更新 (PUT http://localhost:8000/api/configs/:config_id)
    .put(function(req, res) {
        Config.findOne({
            name: req.body.name
        }, function(err, config) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                // コンフィグの各カラムの情報を更新する．
                config.name = req.body.name;
                config.values = req.body.values;

                config.save(function(err) {
                    if (err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    } else {
                        res.status(resCodes.OK.code).json(config);
                    }
                });
            }
        });
    })

    // 一つのコンフィグの情報を削除 (DELETE http://localhost:8000/api/configs/:name)
    .delete(function(req, res) {
        Config.remove({
            name: req.params.name
        }, function(err, config) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json({
                    message: 'Successfully deleted!'
                });
            }
        });
    });

router.route('/configs/find')
    // 条件指定で対象コンフィグ一覧を取得 (GET http://localhost:8080/api/configs/find)
    .post(function(req, res) {
        var page = req.query.page ? req.query.page : pageConfig.page;
        var limit = req.query.limit ? req.query.limit : pageConfig.limit;
        Config.paginate(req.body, { page: page, limit: limit }, function(err, configs) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(configs);
            }
        });
    });

// ルーティング登録
module.exports = router;
