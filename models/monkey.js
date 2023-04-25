const mongoose = require('mongoose');

const monkeySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    age: {
        type: Number,
        required: true,
    },
    cool: {
        type: Boolean,
        required: true,
    },

});

module.exports = mongoose.model('Monkey', monkeySchema);