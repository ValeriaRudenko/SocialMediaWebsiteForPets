const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    image: { type: String},
    label: { type: String, required: true },
    text: { type: String, required: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
