module.exports = {
    getModel: function() {
        return require('../models/user');
    },
    getList: function(req) {
       var  pageConfig  = {
            page: 1,
            limit: 50
        };
        return new Promise(function(resolve, reject) {
            var User = this.getModel();
            var page = req.query.page ? req.query.page : pageConfig.page;
            var limit = req.query.limit ? req.query.limit : pageConfig.limit;
            User.paginate({}, { page: page, limit: limit }, function(err, result) {
                if (err) {
                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                } else {
                    resolve(result);
                }
            });
        });
    },
    get: function(uid) {
        return new Promise(function(resolve, reject) {
            var User = this.getModel();
            User.findOne({
                uid: uid
            }, function(err, user) {
                if (err) {
                    resolve(err);
                } else if (user) {
                    resolve(user);
                } else {
                    resolve(false);
                }
            });
        });
    }
};
