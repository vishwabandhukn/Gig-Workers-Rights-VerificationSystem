const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    platform: { type: String, required: true },
    tripId: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    gpsPath: { type: Array, default: [] }, // Array of {lat, lng, timestamp}
    meta: { type: Object },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trip', tripSchema);
