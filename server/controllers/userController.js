const User = require('../models/User');

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-passwordHash');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Placeholder for fairness summary (will be implemented later)
        const fairnessSummary = {
            score: 85,
            components: { payment: 90, suspension: 80, rating: 85, disputes: 85 }
        };

        res.json({ ...user.toObject(), fairnessSummary });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateMe = async (req, res) => {
    try {
        const { name, phone, language } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (phone) updates.phone = phone;
        if (language) updates.language = language;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: updates },
            { new: true }
        ).select('-passwordHash');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
