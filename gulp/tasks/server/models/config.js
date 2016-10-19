
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var Config   = new Schema({
    name: { type: String, default: '' },
    values:   Schema.Types.Mixed,
    delFlag : { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

// on every save, add the date
Config.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updateDate field to current date
  this.updateDate = currentDate;

  // if createDate doesn't exist, add to that field
  if (!this.createDate)
    this.createDate = currentDate;

  next();
});

module.exports = mongoose.model('config', Config);
