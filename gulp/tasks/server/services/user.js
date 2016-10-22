module.exports = {
    getList: function(req) {
       var  pageConfig  = {
            page: 1,
            limit: 50
        };
        return new Promise(function(resolve, reject) {
            var User = require('../models/user');
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
    }
};
