const PlatformRating = require('../models/PlatformRating');

exports.ratePlatform = async (req, res) => {
    console.log('ratePlatform called');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    try {
        const { platform, ratings, comment } = req.body;
        const rating = new PlatformRating({
            platform,
            userId: req.user.userId,
            ratings,
            comment
        });
        const savedRating = await rating.save();
        console.log('Saved Rating:', savedRating);
        res.json({ ok: true });
    } catch (error) {
        console.error('ratePlatform Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPlatformIndex = async (req, res) => {
    try {
        // Aggregation to calculate averages
        const stats = await PlatformRating.aggregate([
            {
                $group: {
                    _id: '$platform',
                    avgPayment: { $avg: '$ratings.payment' },
                    avgSuspension: { $avg: '$ratings.suspension' },
                    avgSupport: { $avg: '$ratings.support' },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    platform: '$_id',
                    avgPayment: 1,
                    avgSuspension: 1,
                    avgSupport: 1,
                    count: 1,
                    _id: 0
                }
            }
        ]);
        res.json({ platforms: stats });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserRatings = async (req, res) => {
    console.log('getUserRatings called for user:', req.params.userId);
    try {
        const ratings = await PlatformRating.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        console.log('Found ratings items:', ratings.length);
        res.json({ items: ratings });
    } catch (error) {
        console.error('getUserRatings Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
