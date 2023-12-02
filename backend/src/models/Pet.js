// models/pet.js
const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,

    },
    breed: String,
    type: String,
    // Add other pet attributes as needed
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;