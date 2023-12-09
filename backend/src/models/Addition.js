const mongoose = require('mongoose');

const additionSchema = new mongoose.Schema({
    image: { type: String},
    label: { type: String, required: true },
    text: { type: String, required: true },
});

const Addition = mongoose.model('Addition', additionSchema);

module.exports = Addition;
