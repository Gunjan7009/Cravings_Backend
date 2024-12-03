const mongoose = require('mongoose');

const restaurantlistSchema = new mongoose.Schema({
  restaurantName: String,
  address: String,
  logourl: String,
  headerimage: String,
});

module.exports = mongoose.model('Restaurant_List', restaurantlistSchema);