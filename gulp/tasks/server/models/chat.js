
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ChatSchema   = new Schema({
    chatId : { type: String, required: true, unique: true },
    uid : { type: String, required: true },
    title: { type: String, default: '' },
    isDebug : { type: Boolean, default: false },
    delFlag : { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

// on every save, add the date
ChatSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updateDate field to current date
  this.updateDate = currentDate;

  // if createDate doesn't exist, add to that field
  if (!this.createDate)
    this.createDate = currentDate;

  next();
});

module.exports = mongoose.model('Chat', ChatSchema);