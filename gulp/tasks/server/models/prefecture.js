
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PrefectureSchema   = new Schema({
    name: String,
    cities: Array
});

module.exports = mongoose.model('Prefecture', PrefectureSchema);