
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PrivateChatSchema   = new Schema({
    privateChatId : { type: String, required: true, unique: true },
    uid : { type: String, required: true },
    invitedUids: { type: [String], default: [''] },
    inviteUids: { type: [String], default: [''] },
    title: { type: String, default: '' },
    isDebug : { type: Boolean, default: false },
    delFlag : { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

// on every save, add the date
PrivateChatSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updateDate field to current date
  this.updateDate = currentDate;

  // if createDate doesn't exist, add to that field
  if (!this.createDate)
    this.createDate = currentDate;

  next();
});

module.exports = mongoose.model('PrivateChat', PrivateChatSchema);