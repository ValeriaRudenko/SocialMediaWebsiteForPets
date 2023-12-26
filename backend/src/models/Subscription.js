const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    subscribed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
