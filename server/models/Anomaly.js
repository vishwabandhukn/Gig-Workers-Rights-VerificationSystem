const mongoose = require('mongoose');

const anomalySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true }, // penalty_spike, payment_delta, rating_drop
    details: { type: Object },
    score: { type: Number },
    reasons: { type: Array },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Anomaly', anomalySchema);
