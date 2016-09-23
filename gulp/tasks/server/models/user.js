
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    uid : { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    age: { type: Number, default: 0 },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
    message: { type: String, default: '' },
    photoURL: { type: String, default: '' },
    photos: { type: [String], default: [''] },
    cityId: { type: Number, default: 0 },
    prefectureId: { type: Number, default: 0 },
    sexType: { type: Number, default: 0 },
    isEntry : { type: Boolean, default: true },
});

module.exports = mongoose.model('User', UserSchema);
