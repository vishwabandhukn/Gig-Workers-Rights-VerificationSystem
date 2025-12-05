const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'worker' }, // worker, admin
    language: { type: String, default: 'en' },
    connectedAccounts: [{
        platform: String, // e.g., 'Uber', 'Lyft'
        status: { type: String, default: 'Connected' }, // 'Connected', 'Pending', 'Disconnected'
        connectedAt: { type: Date, default: Date.now }
    }],
    profilePicture: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
