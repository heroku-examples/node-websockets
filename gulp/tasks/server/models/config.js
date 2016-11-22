// app/models/config.js
var mongoose     = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var ConfigSchema   = new mongoose.Schema({
    name: { type: String, default: '' },
    values:   mongoose.Schema.Types.Mixed,
    delFlag : { type: Boolean, default: false },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

ConfigSchema.plugin(mongoosePaginate);

// on every save, add the date
ConfigSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updateDate field to current date
  this.updateDate = currentDate;

  // if createDate doesn't exist, add to that field
  if (!this.createDate)
    this.createDate = currentDate;

  next();
});

module.exports = mongoose.model('Config', ConfigSchema);
