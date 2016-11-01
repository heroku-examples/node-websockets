var express = require('express');
var router = express.Router();

var Debug = require('../../models/debug');
var User = require('../../models/user');
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
        res.status(resCodes.UNAUTHORIZED.code).json();
    }
});

router.route('/debug')
    // 一つのデバッグの情報を取得 (GET http://localhost:8000/api/debugs/:debug_id)
    .get(function(req, res) {
        //debug_idが一致するデータを探す．
        Debug.find({
            uid: req.session.token.uid
        }, function(err, debug) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(debug);
            }
        });
    })
    // デバッグの作成 (POST http://localhost:3000/api/debugs)
    .post(function(req, res) {
        Debug.findOne({
            uid: req.body.uid
        }, function(err, debug) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else if (debug) {
                res.status(resCodes.FOUND.code).json(debug);
            } else {
                // 新しいデバッグのモデルを作成する．
                var _debug = new Debug();

                // デバッグの各カラムの情報を取得する
                req.session.token = {};
                _debug.uid = req.body.uid;
                _debug.save(function(err) {
                        if (err) {
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                        } else {
                            res.status(resCodes.OK.code).json(_debug);
                        }
                    })
                    .catch(function(err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    });
                // });
            }
        });
    })

// 一つのデバッグの情報を更新 (PUT http://localhost:8000/api/debugs/:debug_id)
.put(function(req, res) {
    Debug.findOne({
        uid: req.body.uid
    }, function(err, debug) {
        if (err) {
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        } else if (debug) {
            // デバッグの各カラムの情報を更新する．
            debug.delFlag = req.body.delFlag ? req.body.delFlag : false;
            debug.save(function(err) {
                if (err) {
                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                } else {
                    // ユーザーのデバッグ情報を更新する．
                    User.findOneAndUpdate({ uid: req.body.uid }, { isDebug: !debug.delFlag }, function(err, user) {
                        if (err) {
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                        } else {
                            res.status(resCodes.OK.code).json(debug);
                        }
                    });
                }
            });
        } else {
            res.status(resCodes.NOT_FOUND.code).json(err);
        }
    });
})

// 一つのデバッグの情報を削除 (DELETE http://localhost:8000/api/debugs/:name)
.delete(function(req, res) {
    Debug.remove({
        name: req.body.uid
    }, function(err, debug) {
        if (err) {
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        } else {
            res.status(resCodes.OK.code).json({
                message: 'Successfully deleted!'
            });
        }
    });
});

router.route('/debugs')
    // 全てのデバッグ一覧を取得 (GET http://localhost:8080/api/debugs)
    .get(function(req, res) {
        var page = req.query.page ? req.query.page : pageConfig.page;
        var limit = req.query.limit ? req.query.limit : pageConfig.limit;
        Debug.paginate({}, { page: page, limit: limit }, function(err, result) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(result);
            }
        });
    })

// 条件指定で対象デバッグ一覧を取得 (GET http://localhost:8080/api/debugs/find)
.post(function(req, res) {
    var page = req.query.page ? req.query.page : pageConfig.page;
    var limit = req.query.limit ? req.query.limit : pageConfig.limit;
    Debug.paginate(req.body, { page: page, limit: limit }, function(err, debugs) {
        if (err) {
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        } else {
            res.status(resCodes.OK.code).json(debugs);
        }
    });
});

// ルーティング登録
module.exports = router;
