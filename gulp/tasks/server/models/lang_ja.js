
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LangJa   = new Schema({
    name: String,
    texts: Object
});

module.exports = mongoose.model('LangJa', LangJa);