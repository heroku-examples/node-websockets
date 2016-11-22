// console.log('fibase start');
// var gulp = require('gulp');
// var firebase = require("firebase");
// var pkg = require('../../.././package.json');

// var fire = function(){
//   firebase.initializeApp({
//     serviceAccount: "./www/json/firebase/squareGame-8ad71595b440.json",
//     databaseURL: "https://project-3597707734440258770.firebaseio.com"
//   });

//   // var db = firebase.database();
//   // var ref = db.ref("setting");
//   // ref.once("value", function(snapshot) {
//   //   console.log(snapshot.val());
//   //   ref.child('cache').child('number').set(pkg.resourceVersion);
//   //   ref.child('cache').child('date').set(Math.round(new Date().getTime() / 1000));
//   // });

//   var uid = "zcMTtpFeKEhmGPiJWno0310Sv5p1";
//   var additionalClaims = {
//     premiumAccount: true
//   };
//   var token = firebase.auth().createCustomToken(uid, additionalClaims);
//   console.log(token);
// };
// gulp.task('firebase', function(done) {
//   fire();
// });

// fire();