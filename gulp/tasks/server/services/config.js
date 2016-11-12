var Promise = require('es6-promise').Promise;
module.exports = {
    get: function(name, key) {
        return new Promise(function(resolve, reject) {
            var Config = require('../models/config');
            Config.findOne({
                name: name
            }, function(err, record) {
                if (record) {
                    resolve(record.values[name]); // errがなければ成功とみなしresolveを呼び出す
                } else if (err) {
                    reject(err); // errがあればrejectを呼び出す
                } else{
                    resolve(false); // errがなければ成功とみなしresolveを呼び出す
                }
            });
        });
    },
    update: function(name, value) {
        return new Promise(function(resolve, reject) {
            var Config = require('../models/config');
            var values = {values : {}};
            values.values[name] = value;
            Config.findOneAndUpdate({ name: name }, values, function(err, record) {
                if (record) {
                    resolve(value); // errがなければ成功とみなしresolveを呼び出す
                } else if (err) {
                    reject(err); // errがあればrejectを呼び出す
                }else{
                    resolve(false);
                }
            });
        });
    }
};
