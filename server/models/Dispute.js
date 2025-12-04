const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    evidenceIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evidence' }],
    description: { type: String, required: true },
    appealLetter: { type: String }, // JSON string or text
    status: { type: String, default: 'open' }, // open, resolved
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dispute', disputeSchema);
