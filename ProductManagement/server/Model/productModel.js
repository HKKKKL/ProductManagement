const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    id:{
        type: Number,
        unique: true,
        index: true
    },
    number: Number,
    icon: String,
    name: String,
    price: String,
    postage: String,
    discription: String
});

module.exports = mongoose.model('product',productSchema);
