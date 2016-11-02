module.exports = {
    createFriendChat: function(req, fromUid) {
        return new Promise(function(resolve, reject) {
            var firebase = require("firebase");
            firebase.auth().verifyIdToken(req.session.token.token).then(function(decodedToken) {
                var updates = {};
                var record = {
                    comments: [],
                    date: Math.round(new Date().getTime() / 1000),
                    fromUid: fromUid,
                    uid: decodedToken.uid
                };
                updates['/private_chats/' + decodedToken.uid + '/' + fromUid] = record;
                firebase.database().ref().update(updates).then(function(snapshot) {
                    resolve({snapshot: snapshot, url : decodedToken.uid + '/' + fromUid});
                }).catch(function(err) {
                    reject(err);
                });
            }).catch(function(err) {
                reject(err);
            });
        });
    }
};
