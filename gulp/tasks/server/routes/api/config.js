var express = require('express');
var router = express.Router();

var Config = require('../../models/config');
var resCodes = require('../.././json/http/http_code_names.json');

var pageConfig = {
    page: 1,
    limit: 50
};

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
    // 一つのコンフィグの情報を取得 (GET http://localhost:8000/api/config/:config_id)
    .get(function(req, res) {
        //config_idが一致するデータを探す．
        Config.find({
            name: req.body.name
        }, function(err, config) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(config);
            }
        });
    })
    // コンフィグの作成 (POST http://localhost:3000/api/config)
    .post(function(req, res) {
        Config.findOne({
            name: req.body.name
        }, function(err, config) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else if (config) {
                res.status(resCodes.FOUND.code).json(config);
            } else {
                // 新しいコンフィグのモデルを作成する．
                var _config = new Config();

                // コンフィグの各カラムの情報を取得する
                req.session.token = {};
                _config.uid = req.body.uid;
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

    // 一つのコンフィグの情報を更新 (PUT http://localhost:8000/api/config/:config_id)
    .put(function(req, res) {
      Config.findOne({
            name: req.body.name
      }, function(err, config) {
          if (err) {
              res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
          } else if(config) {
              // コンフィグの各カラムの情報を更新する．
              config.delFlag = req.body.delFlag ? req.body.delFlag : false;
              if(req.body.values) config.values = req.body.values;

              config.save(function(err) {
                  if (err) {
                      res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                  } else {
                      res.status(resCodes.OK.code).json(config);
                  }
              });
          }else{
            res.status(resCodes.NOT_FOUND.code).json(err);
          }
      });
    })

    // 一つのコンフィグの情報を削除 (DELETE http://localhost:8000/api/config/:name)
    .delete(function(req, res) {
      Config.remove({
            name: req.body.name
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

router.route('/configs')
    // 全てのコンフィグ一覧を取得 (GET http://localhost:3000/api/configs)
    .get(function(req, res) {
        var page = req.query.page ? req.query.page : pageConfig.page;
        var limit = req.query.limit ? req.query.limit : pageConfig.limit;
        Config.paginate({}, { page: page, limit: limit }, function(err, configs) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(configs);
            }
        });
    })

    // 条件指定で対象コンフィグ一覧を取得 (GET http://localhost:3000/api/configs)
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
