let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RestaurantSchema = new Schema(
    {
        zip_code: {type: String, required: true},
        name: {type: String, required: true},
        entree_price: {type: Number, required: true},
    }
);

//Virtual for restaurant url
RestaurantSchema
.virtual('url')
.get(function () {
  return '/database/restaurant/' + this._id;
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);