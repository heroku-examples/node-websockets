var express = require('express');
var router = express.Router();

var FriendRequest = require('../../models/friend_request');
var User = require('../../models/user');
var UserSearvice = require('../../services/user');
var FireBaseSearvice = require('../../services/firebase');
var resCodes = require('../.././json/http/http_code_names.json');

var log4js = require('log4js');
log4js.configure(require('../.././json/log4js/config.json'));
var logger = log4js.getLogger('system');

var pageConfig = {
    page: 1,
    limit: 50
};

//before filter
router.use(function(req, res, next) {
    if (process.env.NODE_ENV != 'production') {
        if(!req.session.token){
            req.session.token = {};
            req.session.token.uid = 'zcMTtpFeKEhmGPiJWno0310Sv5p1';
        }
        next();
    } else if (req.session.token) {
        next();
    } else {
        //Return a response immediately
        res.status(resCodes.BAD_REQUEST.code).json(resCodes.BAD_REQUEST);
    }
});

router.route('/friend_request/:targetUid')
    // セッションユーザの取得 (POST http://localhost:3000/api/user)
    .get(function(req, res){
        FriendRequest.findOne({
            uid: req.params.targetUid,
            fromUid: req.session.token.uid
        }, function(err, friend_request) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else if (friend_request) {
                res.status(resCodes.OK.code).json(friend_request);
            } else {
                res.status(resCodes.OK.code).json(friend_request);
            }
        });
    })

    // フレンドリクエストの作成 (POST http://localhost:3000/api/friend_request)
    .post(function(req, res) {
        UserSearvice.get(req.body.targetUid).then(function(user) {
            if (user) {
                FriendRequest.findOne({
                    uid: req.body.targetUid,
                    fromUid: req.session.token.uid
                }, function(err, friend_request) {
                    if (err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    } else if (friend_request) {
                        res.status(resCodes.FOUND.code).json(friend_request);
                    } else {
                        // 新しいフレンドリクエストのモデルを作成する．
                        var _friend_request = new FriendRequest();

                        // フレンドリクエストの各カラムの情報を取得する
                        _friend_request.uid = req.body.targetUid;
                        _friend_request.fromUid = req.session.token.uid;
                        _friend_request.save(function(err) {
                                if (err) {
                                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                                } else {
                                    res.status(resCodes.OK.code).json(_friend_request);
                                }
                            })
                            .catch(function(err) {
                                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                            });
                    }
                });
            } else {
                res.status(resCodes.NOT_FOUND.code).json();
            }
        }, function(error) {
            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
        });
    })

    // 一つのフレンドリクエストの情報を更新 (PUT http://localhost:8000/api/friend_request/:friend_request_id)
    .put(function(req, res) {
        FriendRequest.findOne({
            uid: req.session.token.uid,
            fromUid: req.body.targetUid
        }, function(err, friend_request) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else if (friend_request) {
                // フレンドリクエストの各カラムの情報を更新する．
                friend_request.delFlag = req.body.delFlag ? req.body.delFlag : false;
                friend_request.save(function(err) {
                    if (err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    } else {
                        // ユーザーのフレンドリクエスト情報を更新する．
                        User.findOneAndUpdate({ uid: req.body.uid }, { isFriendRequest: !friend_request.delFlag }, function(err, user) {
                            if (err) {
                                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                            } else {
                                res.status(resCodes.OK.code).json(friend_request);
                            }
                        });
                    }
                });
            } else {
                res.status(resCodes.NOT_FOUND.code).json(err);
            }
        });
    })

    // 一つのフレンドリクエストの情報を削除 (DELETE http://localhost:8000/api/friend_request/:name)
    .delete(function(req, res) {
        FriendRequest.remove({
            uid: req.session.token.uid,
            fromUid: req.body.targetUid
        }, function(err, friend_request) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json({
                    message: 'Successfully deleted!'
                });
            }
        });
    });

router.route('/friend_request/reject/:fromUid')
    // 全てのフレンド拒否済みリクエスト一覧を取得 (GET http://localhost:8080/api/friend_requests)
    .get(function(req, res) {
        var page = req.query.page ? req.query.page : pageConfig.page;
        var limit = req.query.limit ? req.query.limit : pageConfig.limit;
        FriendRequest.paginate({ uid: req.session.token.uid, isRejected: true }, { page: page, limit: limit }, function(err, result) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(result);
            }
        });
    })

    // 一つのフレンドリクエストの情報を更新 (PUT http://localhost:8000/api/friend_requests/:friend_request_id)
    .put(function(req, res) {
        FriendRequest.findOne({
            uid: req.session.token.uid,
            fromUid: req.params.fromUid
        }, function(err, friend_request) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else if (friend_request) {
                // フレンドリクエストの各カラムの情報を更新する．
                friend_request.isRejected = true;
                friend_request.save(function(err) {
                    if (err) {
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    } else {
                        res.status(resCodes.OK.code).json(friend_request);
                    }
                });
            } else {
                res.status(resCodes.NOT_FOUND.code).json(err);
            }
        });
    });

router.route('/friend_request/apply/:fromUid')
    // 全てのフレンド拒否済みリクエスト一覧を取得 (GET http://localhost:8080/api/friend_requests)
    .get(function(req, res) {
        var page = req.query.page ? req.query.page : pageConfig.page;
        var limit = req.query.limit ? req.query.limit : pageConfig.limit;
        FriendRequest.paginate({ uid: req.session.token.uid, isApplyed: true }, { page: page, limit: limit }, function(err, result) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(result);
            }
        });
    })
    // 一つのフレンドリクエストの情報を更新 (PUT http://localhost:8000/api/friend_requests)
    .put(function(req, res) {
        FriendRequest.findOne({
            uid: req.session.token.uid,
            fromUid: req.params.fromUid
        }, function(err, friend_request) {
            if (err) {
                console.log('err' , err, err.lineNumber);
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else if (friend_request) {
                // フレンドリクエストの各カラムの情報を更新する．
                friend_request.isApplyed = true;
                friend_request.save(function(err) {
                    if (err) {
                        console.log('err' , err, err.lineNumber);
                        res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                    } else {
                        FireBaseSearvice.createFriendChat(req, req.params.fromUid).then(function(snapshot) {
                            res.status(resCodes.OK.code).json(snapshot);
                        }, function(err) {
                            console.log('err' , err, err.lineNumber);
                            res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                        });
                    }
                });
            } else {
                res.status(resCodes.NOT_FOUND.code).json();
            }
        });
    });

router.route('/friend_requests')
    // 全てのフレンドリクエスト一覧を取得 (GET http://localhost:8080/api/friend_requests)
    .get(function(req, res) {
        var page = req.query.page ? req.query.page : pageConfig.page;
        var limit = req.query.limit ? req.query.limit : pageConfig.limit;
        FriendRequest.paginate({ uid: req.session.token.uid }, { page: page, limit: limit }, function(err, requests) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                if(requests.docs.length){
                    var _ = require('underscore');
                    var uids = _.map(requests.docs, function(friend){ return friend.fromUid; });

                    var result = [];
                    UserSearvice.getList(uids).then(function(friends) {
                        for (var i = 0; i < friends.length; i++) {
                            var friend_request = _.find(
                                requests.docs,
                                function(request){
                                    return friends[i].uid == request.uid;
                                }
                            );
                            result.push(
                                {
                                    friend_request : friend_request,
                                    friend : friends[i]
                                }
                            );
                        }
                        res.status(resCodes.OK.code).json({
                            docs :result,
                            total: requests.total,
                            limit: requests.limit,
                            page: requests.page,
                            pages: requests.pages
                        });
                    }, function(error) {
                        console.log("Rejected:", error.message);
                    });
                }else{
                    res.status(resCodes.OK.code).json();
                }
            }
        });
    })

    // 条件指定で対象フレンドリクエスト一覧を取得 (GET http://localhost:8080/api/friend_requests/find)
    .post(function(req, res) {
        var page = req.query.page ? req.query.page : pageConfig.page;
        var limit = req.query.limit ? req.query.limit : pageConfig.limit;
        FriendRequest.paginate(req.body, { page: page, limit: limit }, function(err, friend_requests) {
            if (err) {
                res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
            } else {
                res.status(resCodes.OK.code).json(friend_requests);
            }
        });
    });

// ルーティング登録
module.exports = router;
