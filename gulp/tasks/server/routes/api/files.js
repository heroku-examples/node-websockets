var express = require('express');
var router = express.Router();

var Prefecture = require('../../models/prefecture');
var prefectures = require('../.././json/location/prefectures.json');
var Profile = require('../../models/profile');
var profiles = require('../.././json/profile/profiles.json');
var Lang = require('../../models/lang_ja');
var langs = require('../.././json/lang/lang_ja.json');

var errors = require('../.././json/error/error_code_names.json');

router.route('/files/location')
// 全てのprefecture一覧を取得 (GET http://localhost:8000/api/files/location)
.get(function(req, res) {
    Prefecture.find(function(err, prefectures) {
        if (err) {
            res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
        } else {
            res.status(200).json(prefectures);
        }
    });
});

router.route('/files/profile')
// 全てのprefecture一覧を取得 (GET http://localhost:8000/api/files/profile)
.get(function(req, res) {
    Profile.find(function(err, profiles) {
        if (err) {
            res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
        } else {
            res.status(200).json(profiles);
        }
    });
});

router.route('/files/lang/ja')
// 全てのprefecture一覧を取得 (GET http://localhost:8000/api/files/lang/ja)
.get(function(req, res) {
    Lang.find(function(err, profiles) {
        if (err) {
            res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
        } else {
            res.status(200).json(profiles);
        }
    });
});

router.route('/files/location/sync_by_json')
// 全てのユーザ一覧を取得 (GET http://localhost:8000/api/files/location/sync_by_json)
.post(function(req, res) {
    prefectures.forEach(function( record ) {
        var prefecture = new Prefecture(record);
        prefecture.save(function(err) {
             if (err) {
                res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
            }
        });
    });
    res.status(200).json({success :true});
});

router.route('/files/profile/sync_by_json')
// 全てのユーザ一覧を取得 (GET http://localhost:8000/api/files/profile/sync_by_json)
.post(function(req, res) {
    Object.keys(profiles).forEach(function( key ) {
        var record = profiles[key];
        record.name = key;
        var profile = new Profile(record);
        profile.save(function(err) {
             if (err) {
                res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
            }
        });
    });
    res.status(200).json({success :true});
});

router.route('/files/lang/ja/sync_by_json')
// 全てのユーザ一覧を取得 (GET http://localhost:8000/api/files/lang/ja/sync_by_json)
.post(function(req, res) {
    Object.keys(langs).forEach(function( key ) {
        var record = {name :key, texts :langs[key]};
        var lang = new Lang(record);
        lang.save(function(err) {
             if (err) {
                res.status(errors.INTERNAL_SERVER_ERROR.code).json(err);
            }
        });
    });
    res.status(200).json({success :true});
});

// ルーティング登録
module.exports = router;
