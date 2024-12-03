const mongoose = require('mongoose');

const dealCardsSchema = new mongoose.Schema({
    dealcardname: String,
    dealcardrestaurant: String,
    dealcardimgurl: String,
})

module.exports = mongoose.model('dealcards', dealCardsSchema);