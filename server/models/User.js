const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    passwordHash: { type: String, required: true },
    role: { type: String, default: 'worker' }, // worker, admin
    language: { type: String, default: 'en' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
