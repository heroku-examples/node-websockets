var Promise = require('es6-promise').Promise;
module.exports = {
    getRecommends: function (req) {
        var pageConfig = {
            page: 1,
            limit: 50
        };
        return new Promise(function (resolve, reject) {
            var User = require('../models/user');
            var page = req.query.page ? req.query.page : pageConfig.page;
            var limit = req.query.limit ? req.query.limit : pageConfig.limit;
            if(!req.session.userInfos){
                User.paginate({ uid: { '$ne': req.session.token.uid } }, { page: page, limit: limit }, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }else{
              var _ = require('underscore');
              var knownUids = _.map(req.session.userInfos, function (friend) { return friend.uid; });
              User.paginate({ uid: { '$ne': req.session.token.uid , "$nin": knownUids } }, { page: page, limit: limit }, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });          
            }

        });
    },
    get: function (uid) {
        return new Promise(function (resolve, reject) {
            var User = require('../models/user');
            User.findOne({
                uid: uid
            }, function (err, user) {
                if (err) {
                    reject(err);
                } else if (user) {
                    resolve(user);
                } else {
                    resolve(false);
                }
            });
        });
    },
    getList: function (uids) {
        return new Promise(function (resolve, reject) {
            var User = require('../models/user');
            User.find({
                uid: { "$in": uids }
            }, function (err, users) {
                if (err) {
                    reject(err);
                } else if (users) {
                    resolve(users);
                } else {
                    resolve(false);
                }
            });
        });
    },
    getFriends: function (req) {
        return new Promise(function (resolve, reject) {
            var pageConfig = {
                page: 1,
                limit: 50
            };
            var page = req.query.page ? req.query.page : pageConfig.page;
            var limit = req.query.limit ? req.query.limit : pageConfig.limit;
            var FriendRequest = require('../models/friend_request');
            var query = FriendRequest.find({
                $or: [
                    { uid: req.session.token.uid, fromUid: { '$ne': req.session.token.uid } },
                    { uid: { '$ne': req.session.token.uid }, fromUid: req.session.token.uid }
                ]
            }).sort([['uid', 1], ['fromUid', 1]]);
            FriendRequest.paginate(query, { page: page, limit: limit }, function (err, requests) {
                if (err) {
                    reject(err);
                } else {
                    if (requests.docs.length) {
                        var _ = require('underscore');
                        var fromUids = _.map(requests.docs, function (friend) { return friend.fromUid; });
                        var toUids = _.map(requests.docs, function (friend) { return friend.uid; });
                        var uids = _.union(fromUids, toUids);
                        var User = require('../models/user');
                        User.find({
                            uid: { "$in": uids }
                        }, function (err, users) {
                            if (err) {
                                reject(err);
                            } else if (users) {
                                var userInfos = _.indexBy(users, 'uid');
                                resolve(userInfos);
                            } else {
                                resolve(false);
                            }
                        });
                    } else {
                        resolve(false);
                    }
                }
            });
        });
    }
};
