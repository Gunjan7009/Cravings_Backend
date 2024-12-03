const mongoose = require('mongoose');

const offerCardsSchema = new mongoose.Schema({
    offercardrestaurant: String,
    category: String,
    offercardimgurl: String,
})

module.exports = mongoose.model('offercards', offerCardsSchema);