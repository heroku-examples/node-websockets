var Promise = require('es6-promise').Promise;
var firebase = require("firebase");
module.exports = {
    init: function (uid) {
        firebase.initializeApp({
            serviceAccount: "./www/json/firebase/squareGame-8ad71595b440.json",
            databaseURL: "https://project-3597707734440258770.firebaseio.com"
        });

        var additionalClaims = {
            adminToken: true
        };
        var token = firebase.auth().createCustomToken(uid, additionalClaims);
        var Config = require('./../services/config');
        Config.update('adminToken', token).then(function (records) {
            console.log("firebase success", records)
        }, function (error) {
            console.log("firebase error", error)
        });
    },
    createFriendChat: function (req, fromUid) {
        return new Promise(function (resolve, reject) {

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
    sendFriendChatComment: function (req, url, targetUid, text, photoURL) {
        if (!photoURL) photoURL = '';
        return new Promise(function (resolve, reject) {

            var comments = firebase.database().ref('/private_chats/' + url).child('comments').push();
            comments.set({
                text: text,
                uid: req.session.token.uid,
                photoURL: photoURL,
                createDate: Date.now()
            }).then(function (_comments) {
                var unread = firebase.database().ref('/private_chats/' + url + '/unread/').child(targetUid)
                unread.transaction(function (current_value) {
                    if (!current_value) current_value = {};
                    return { count: (current_value.count || 0) + 1, text: text };
                }, function (err, committed, snapshot) {
                    if (err)
                        reject(err);
                    else if (!committed)
                        reject(false);
                    else
                        resolve({ snapshot: snapshot.val() });
                });
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    readChatComment: function (req, url) {
        return new Promise(function (resolve, reject) {

            var unread = firebase.database().ref('/private_chats/' + url + '/unread/').child(req.session.token.uid)
            unread.transaction(function (current_value) {
                if (!current_value) current_value = {};
                return { count: 0, text: current_value.text ? current_value.text : '' };
            }, function (err, committed, snapshot) {
                if (err)
                    reject(err);
                else if (!committed)
                    reject(false);
                else
                    resolve({ snapshot: snapshot.val() });
            });

        });
    },
    sendNotify: function (req, text, fromUid, targetUid, photoURL) {
        if (!photoURL) photoURL = '';
        return new Promise(function (resolve, reject) {

            var path = '/notify/' + targetUid + '/' + fromUid;
            var messages = firebase.database().ref(path).child('messages').push();
            messages.set({
                text: text,
                fromUid: fromUid,
                photoURL: photoURL,
                createDate: Date.now()
            }).then(function (_messages) {
                resolve({ record: _messages, url: req.session.token.uid });
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    createNotify: function (req, adminToken) {
        return new Promise(function (resolve, reject) {

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
                if (!record) {
                    resolve(false);
                } else {
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
    webPush2: function (req, endpoint, auth, p256dh, text, data) {
        if (!req.session.token) return;
        if( !data) data = false;
        return new Promise(function (resolve, reject) {
            var webpush = require('web-push');

            // VAPID keys should only be generated only once.
            var vapidKeys = webpush.generateVAPIDKeys();

            webpush.setGCMAPIKey('AIzaSyABUweSPHa_1XDaXmhXU0RhMGZokiJIapY');
            webpush.setVapidDetails(
                'mailto:parmalatinter@gmail.com',
                vapidKeys.publicKey,
                vapidKeys.privateKey
            );

            // This is the same output of calling JSON.stringify on a PushSubscription
            var pushSubscription = {
                endpoint: endpoint,
                keys: {
                    auth: auth,
                    p256dh: p256dh
                }
            };

            var mongoose = require('mongoose');
            var Identification = mongoose.model('Identification');
            Identification.findOneAndUpdate({ uid: req.session.token.uid }, { pushSubscription: pushSubscription }, function (err, identification) {
                if (err) {
                    res.status(resCodes.INTERNAL_SERVER_ERROR.code).json(err);
                } else {
                    webpush.sendNotification(pushSubscription,JSON.stringify({text : text, data : data}) );
                    resolve(pushSubscription);
                }
            });
        }).catch(function (err) {
            console.log(err)
            //reject(err);
        });
    },
    webPushToFriend: function (req, targetUid, text, data) {
        if (!req.session.token) return;
        if( !data) data = false;
        return new Promise(function (resolve, reject) {
            var mongoose = require('mongoose');
            var Identification = mongoose.model('Identification');
            Identification.findOne({
                uid: targetUid
            }, function (err, identification) {
                if (err) {
                    resolve(err);
                } else if (identification) {
                    var webpush = require('web-push');

                    // VAPID keys should only be generated only once.
                    var vapidKeys = webpush.generateVAPIDKeys();

                    webpush.setGCMAPIKey('AIzaSyABUweSPHa_1XDaXmhXU0RhMGZokiJIapY');
                    webpush.setVapidDetails(
                        'mailto:parmalatinter@gmail.com',
                        vapidKeys.publicKey,
                        vapidKeys.privateKey
                    );

                    // This is the same output of calling JSON.stringify on a PushSubscription
                    var pushSubscription = {
                        endpoint: identification.pushSubscription.endpoint,
                        keys: {
                            auth: identification.pushSubscription.keys.auth,
                            p256dh: identification.pushSubscription.keys.p256dh
                        }
                    };

                    webpush.sendNotification(pushSubscription, JSON.stringify({text : text, data : data}) );
                    resolve(pushSubscription);

                } else {
                    resolve();
                }
            });
        }).catch(function (err) {
            console.log(err)
            //reject(err);
        });
    },
    webPush: function (req, registrationIds) {
        if (!req.session.token && !req.session.isDebug) return;
        return new Promise(function (resolve, reject) {

            var body =
                {
                    "registration_ids": registrationIds,
                    "data": {
                        "text": "LogIned"
                    },
                    "notification": {
                        "title": "1",
                        "text": "23"
                    }
                };
            var request = require('request');
            request({
                url: 'https://fcm.googleapis.com/fcm/send',
                method: 'POST',
                headers: {
                    'Content-Type': ' application/json',
                    'Authorization': 'key=AIzaSyABUweSPHa_1XDaXmhXU0RhMGZokiJIapY'
                },
                body: JSON.stringify(body)
            }, function (error, response, body) {
                if (error) {
                    reject(err);
                }
                else if (response.statusCode >= 400) {
                    reject('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage + '\n' + body);
                }
                else {
                    resolve(response);
                }
            });
        }).catch(function (err) {
            console.log(err)
            //reject(err);
        });
    },
};
