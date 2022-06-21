const mongoose = require ('mongoose');
const Schema = mongoose.Schema

const localShopSchema = new Schema({
    shopName : String,
    image : String,
    price : Number,
    description:String,
    location : String,
});

module.exports = mongoose.model('localshop',localShopSchema);