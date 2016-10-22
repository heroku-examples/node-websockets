
// app/models/friend.js
var mongoose     = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var FriendSchema   = new mongoose.Schema({
    uid : { type: String, required: true },
    fromUid :{ type: String, required: true },
    isRejected : { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

FriendSchema.plugin(mongoosePaginate);

// on every save, add the date
FriendSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updateDate field to current date
  this.updateDate = currentDate;

  // if createDate doesn't exist, add to that field
  if (!this.createDate)
    this.createDate = currentDate;

  next();
});



module.exports = mongoose.model('FriendRequest', FriendSchema);