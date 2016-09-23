
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TokenSchema   = new Schema({
    uid : { type: String, required: true, unique: true },
    token : { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Token', TokenSchema);
