module.exports = {
    createFriendChat: function (req, fromUid) {
        return new Promise(function (resolve, reject) {
            var firebase = require("firebase");
            firebase.auth().verifyIdToken(req.session.token.token).then(function (decodedToken) {
                var updates = {};
                var record = {
                    comments: [],
                    date: Math.round(new Date().getTime() / 1000),
                    fromUid: fromUid,
                    uid: decodedToken.uid
                };
                updates['/private_chats/' + decodedToken.uid + '/' + fromUid] = record;
                firebase.database().ref().update(updates).then(function (snapshot) {
                    resolve({ snapshot: snapshot, url: decodedToken.uid + '/' + fromUid });
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    sendFriendChatComment: function (req, url, text) {
        return new Promise(function (resolve, reject) {
            var firebase = require("firebase");
            firebase.auth().verifyIdToken(req.session.token.token).then(function (decodedToken) {
                var comments = firebase.database().ref(url).child('comments').push();
                comments.set({
                    text: text,
                    uid: req.session.token.uid,
                }).then(function (_comments) {
                    resolve({ record: _comments, url: decodedToken.uid });
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    sendNotify: function (req, adminToken, text, fromUid, photoURL) {
        return new Promise(function (resolve, reject) {
            var firebase = require("firebase");
            firebase.auth().signInWithCustomToken(adminToken).then(function (decodedToken) {
                var path = '/notify/' + req.session.token.uid;
                var comments = firebase.database().ref(path).child('comments');
                comments.$add({
                    text: text,
                    fromUid: fromUid,
                    photoURL: photoUrl
                }).then(function (_comments) {
                    resolve({ record: _comments, url: req.session.token.uid });
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    createNotify: function (req, adminToken) {
        return new Promise(function (resolve, reject) {
            var firebase = require("firebase");
            firebase.auth().signInWithCustomToken(adminToken).then(function (decodedToken) {
                var updates = {};
                var record = {
                    messages: [],
                    date: Math.round(new Date().getTime() / 1000),
                };
                updates['/notify/' + decodedToken.uid] = record;
                firebase.database().ref().update(updates).then(function (snapshot) {
                    resolve({ snapshot: snapshot, url: decodedToken.uid + '/' + fromUid });
                }).catch(function (err) {
                    reject(err);
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    getAdminToken: function () {
        return new Promise(function (resolve, reject) {
            var Config = require('./../services/config');
            Config.get('adminToken').then(function (record) {
                if(!record){
                    resolve(false);
                } else{
                    resolve(record.adminToken);
                }  
            }, function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    },
    updateAdminToken: function (req) {
        if (!req.session.token && !req.session.isDebug) return;
        return new Promise(function (resolve, reject) {
            var firebase = require("firebase");
            var uid = "zcMTtpFeKEhmGPiJWno0310Sv5p1";
            var additionalClaims = {
                adminToken: true
            };
            var token = firebase.auth().createCustomToken(uid, additionalClaims);
            var Config = require('./config');
            Config.update('adminToken', token).then(function (records) {
                resolve(records);
            }, function (error) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    },
};
