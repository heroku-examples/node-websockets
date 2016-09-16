
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    uid : { type: String, required: true, unique: true },
    name: String,
    age: Number,
    currentPlatform: String,
    currentPlatformVersion: Number,
    date: Number,
    message: String,
    photoURL: String,
    photos: [String],
    cityId: Number,
    prefectureId: Number,
    sexType: Number
});

module.exports = mongoose.model('User', UserSchema);
