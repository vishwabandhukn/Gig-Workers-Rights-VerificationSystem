const mongoose = require('mongoose');

const platformRatingSchema = new mongoose.Schema({
    platform: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ratings: {
        payment: { type: Number, required: true },
        suspension: { type: Number, required: true },
        support: { type: Number, required: true }
    },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PlatformRating', platformRatingSchema);
