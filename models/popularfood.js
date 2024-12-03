const mongoose = require('mongoose');

const popularfoodSchema = new mongoose.Schema({
  popularfoodname: String,
  no_of_restaurant: String,
  foodurl: String,
});

module.exports = mongoose.model('popularfoods', popularfoodSchema);