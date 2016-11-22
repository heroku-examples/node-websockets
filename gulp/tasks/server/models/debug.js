// app/models/debug.js
var mongoose     = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var DebugSchema   = new mongoose.Schema({
    uid : { type: String, required: true, unique: true },
    jackUid : { type: String },
    isJack : { type: Boolean, default: false },
    delFlag : { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

DebugSchema.plugin(mongoosePaginate);

// on every save, add the date
DebugSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updateDate field to current date
  this.updateDate = currentDate;

  // if createDate doesn't exist, add to that field
  if (!this.createDate)
    this.createDate = currentDate;

  next();
});

module.exports = mongoose.model('Debug', DebugSchema);
