
// app/models/user.js

var mongoose     = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema       = mongoose.Schema;

var BannerSchema   = new Schema({
    title: { type: String, default: '' },
    isDebug : { type: Boolean, default: false },
    delFlag : { type: Boolean, default: false },
    imageUrl: { type: String, default: '' },
    linkUrl: { type: String, default: '' },
    detail: { type: String, default: '' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    createDate: { type: Date, default: Date.now },
    updateDate: { type: Date, default: Date.now },
});

BannerSchema.plugin(mongoosePaginate);

// on every save, add the date
BannerSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  // change the updateDate field to current date
  this.updateDate = currentDate;

  // if createDate doesn't exist, add to that field
  if (!this.createDate)
    this.createDate = currentDate;

  next();
});

module.exports = {
    getIncremental : function(req){
        var autoIncrement = req.app.get('autoIncrement');
        BannerSchema.plugin(autoIncrement.plugin, { model: 'Banner', field: 'bannerId' });
        return mongoose.model('Banner', BannerSchema);
    },
    get : function(){
        return mongoose.model('Banner', BannerSchema);
    }
}
