const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripId: { type: String },
    s3Url: { type: String, required: true },
    sha256: { type: String, required: true },
    tags: { type: Array, default: [] },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Evidence', evidenceSchema);
