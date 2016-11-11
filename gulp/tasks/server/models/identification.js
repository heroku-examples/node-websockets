
// app/models/identification.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var IdentificationSchema   = new Schema({
    uid : { type: String, required: true, unique: true },
    token : { type: String, required: true },
    pushSubscription : mongoose.Schema.Types.Mixed,
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

// on every save, add the date
IdentificationSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updateDate field to current date
  this.updateDate = currentDate;

  // if createDate doesn't exist, add to that field
  if (!this.createDate)
    this.createDate = currentDate;

  next();
});

module.exports = mongoose.model('Identification', IdentificationSchema);
