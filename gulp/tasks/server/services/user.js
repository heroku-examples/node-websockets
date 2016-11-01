module.exports = {
    getRecommends: function(req) {
       var  pageConfig  = {
            page: 1,
            limit: 50
        };
        return new Promise(function(resolve, reject) {
            var User = require('../models/user');
            var page = req.query.page ? req.query.page : pageConfig.page;
            var limit = req.query.limit ? req.query.limit : pageConfig.limit;
            User.paginate({uid: {'$ne':req.session.token.uid }}, { page: page, limit: limit }, function(err, result) {
                if (err) {
                   reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    get: function(uid) {
        return new Promise(function(resolve, reject) {
            var User = require('../models/user');
            User.findOne({
                uid: uid
            }, function(err, user) {
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
    getList : function(uids){
        return new Promise(function(resolve, reject) {
            var User = require('../models/user');
            User.find({
                uid: { "$in" : uids}
            }, function(err, users) {
                if (err) {
                    reject(err);
                } else if (users) {
                    resolve(users);
                } else {
                    resolve(false);
                }
            });
        });
    }
};
