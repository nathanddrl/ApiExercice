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
    strength: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    intelligence: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    speed: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    parentId1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monkey',
    },
    parentId2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Monkey',
    },
});

module.exports = mongoose.model('Monkey', monkeySchema);
