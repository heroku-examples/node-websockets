
// app/models/user.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    uid : { type: String, required: true, unique: true },
    name: { type: String, default: '' },
    age: { type: Number, default: 0 },
    message: { type: String, default: '' },
    photoURL: { type: String, default: '' },
    photos: { type: [String], default: [''] },
    cityId: { type: Number, default: 0 },
    prefectureId: { type: Number, default: 0 },
    sexType: { type: Number, default: 0 },
    isEntry : { type: Boolean, default: true },
    isDebug : { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

// on every save, add the date
UserSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updateDate field to current date
  this.updateDate = currentDate;

  // if createDate doesn't exist, add to that field
  if (!this.createDate)
    this.createDate = currentDate;

  next();
});

module.exports = mongoose.model('User', UserSchema);
