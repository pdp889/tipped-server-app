let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let PaySchema = new Schema(
    {
        hourly_pay: {type: Number, required: true},
        weekly_tips: {type: Number, required: true},
        weekly_hours: {type: Number, required: true},
        restaurant: {type: Schema.Types.ObjectId, ref: 'Restaurant', required: true},
        user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    }
);

//Virtual for pay url
PaySchema
.virtual('url')
.get(function () {
  return '/database/pay/' + this._id;
});

module.exports = mongoose.model('Pay', PaySchema);