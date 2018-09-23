const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: Number,
        unique: true,
        index: true
    },
    accountName: String,
    password: String
});

module.exports = mongoose.model('user',userSchema);
