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

        res.json({ user, fairnessSummary });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateMe = async (req, res) => {
    try {
        const { name, language } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { $set: { name, language } },
            { new: true }
        ).select('-passwordHash');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
