var express = require('express');
var router = express.Router();

var _Banner = require('../../models/banner');
var Banner;
var resCodes = require('../.././json/http/http_code_names.json');

var pageBanner = {
    page: 1,
    limit: 50
};

//before filter
router.use(function(req, res, next) {
    Banner = _Banner.getIncremental(req)
    if (process.env.NODE_ENV != 'production') {
        next();
    } else if (req.session.token && req.session.isDebug) {
        next();
    } else {
        //Return a response immediately
        res.status(resCodes.UNAUTHORIZED.code).json();
    }
});

router.route('/banner')
    // 一つのバナーの情報を取得 (GET http://localhost:8000/api/banner/:banner_id)
    .get(function(req, res) {
        //banner_idが一致するデータを探す．
        Banner.find({
            name: req.body.name
        }, function(err, banner) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(banner);
            }
        });
    })
    // バナーの作成 (POST http://localhost:3000/api/banner)
    .post(function(req, res) {
        Banner.findOne({
            title: req.body.title
        }, function(err, banner) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else if (banner) {
                res.status(resCodes.FOUND.code).json(banner);
            } else {

                var record = {
                    title: req.body.title? req.body.title : '',
                    isDebug: req.body.isDebug? req.body.isDebug : false,
                    delFlag: req.body.delFlag? req.body.delFlag : false,
                    imageUrl: req.body.imageUrl? req.body.imageUrl : '',
                    linkUrl: req.body.linkUrl? req.body.linkUrl : '',
                    detail: req.body.detail? req.body.detail : '',
                    startDate: req.body.startDate? req.body.startDate : new Date(),
                    endDate: req.body.endDate? req.body.endDate : new Date(),
                }
                // 新しいバナーのモデルを作成する．
                var _banner = new Banner();

                // バナーの各カラムの情報を取得する
                req.session.token = {};

                _banner.save(function(err) {
                        if (err) {
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                        } else {
                            res.status(resCodes.OK.code).json(_banner);
                        }
                    })
                    .catch(function(err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    });
                // });
            }
        });
    })

    // 一つのバナーの情報を更新 (PUT http://localhost:8000/api/banner/:banner_id)
    .put(function(req, res) {
      Banner.findOne({
            name: req.body.name
      }, function(err, banner) {
          if (err) {
              res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
          } else if(banner) {
              // バナーの各カラムの情報を更新する．
              banner.delFlag = req.body.delFlag ? req.body.delFlag : false;
              if(req.body.values) banner.values = req.body.values;

              banner.save(function(err) {
                  if (err) {
                      res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                  } else {
                      res.status(resCodes.OK.code).json(banner);
                  }
              });
          }else{
            res.status(resCodes.NOT_FOUND.code).json(err);
          }
      });
    })

    // 一つのバナーの情報を削除 (DELETE http://localhost:8000/api/banner/:name)
    .delete(function(req, res) {
      Banner.remove({
            name: req.body.name
      }, function(err, banner) {
          if (err) {
              res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
          } else {
              res.status(resCodes.OK.code).json({
                  message: 'Successfully deleted!'
              });
          }
      });
    });

router.route('/banners')
    // 全てのバナー一覧を取得 (GET http://localhost:3000/api/banners)
    .get(function(req, res) {
        var page = req.query.page ? req.query.page : pageBanner.page;
        var limit = req.query.limit ? req.query.limit : pageBanner.limit;
        Banner.paginate({}, { page: page, limit: limit }, function(err, banners) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(banners);
            }
        });
    })

    // 条件指定で対象バナー一覧を取得 (GET http://localhost:3000/api/banners)
    .post(function(req, res) {
        var page = req.query.page ? req.query.page : pageBanner.page;
        var limit = req.query.limit ? req.query.limit : pageBanner.limit;
        Banner.paginate(req.body, { page: page, limit: limit }, function(err, banners) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(banners);
            }
        });
    });

// ルーティング登録
module.exports = router;
