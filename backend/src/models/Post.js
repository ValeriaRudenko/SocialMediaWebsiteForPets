const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image: { type: String},
    label: { type: String, required: true },
    text: { type: String, required: true },
    autor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const User = mongoose.model('Post', postSchema);

module.exports = User;
