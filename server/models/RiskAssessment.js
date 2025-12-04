const mongoose = require('mongoose');

const riskAssessmentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    stats: {
        cancellations: Number,
        acceptRate: Number,
        avgRating: Number,
        penalties: Number,
        lastSuspensionDays: Number
    },
    prediction: {
        riskLevel: String,
        score: Number,
        reasons: [String],
        mitigation: [String]
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RiskAssessment', riskAssessmentSchema);
