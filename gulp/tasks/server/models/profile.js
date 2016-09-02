
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ProfileSchema   = new Schema({
    name: String,
    values: Array,
    type : String,
    unit : String
});

module.exports = mongoose.model('Profile', ProfileSchema);