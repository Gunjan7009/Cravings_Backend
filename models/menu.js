const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  Dish_name: String,
  description: String,
  category: String,
  price: String,
  imageUrl: String,
});

module.exports = mongoose.model('Menu', menuSchema);