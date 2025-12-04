const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, required: true },
    period: { type: String, required: true }, // e.g., "2023-W40"
    platformStatement: { type: Object, required: true }, // The JSON from platform
    actualReceived: { type: Number, required: true },
    verified: { type: Boolean, default: false },
    delta: { type: Number, default: 0 },
    issues: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payout', payoutSchema);
