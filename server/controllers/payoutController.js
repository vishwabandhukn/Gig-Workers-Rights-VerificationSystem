const Payout = require('../models/Payout');
const Anomaly = require('../models/Anomaly');

exports.submitPayout = async (req, res) => {
    try {
        const { platform, period, platformStatement, actualReceived } = req.body;

        // Logic: expected = sum(platformStatement.items[].amount) OR platformStatement.total
        let expected = 0;
        if (platformStatement.total) {
            expected = platformStatement.total;
        } else if (platformStatement.items && Array.isArray(platformStatement.items)) {
            expected = platformStatement.items.reduce((sum, item) => sum + (item.amount || 0), 0);
        }

        const delta = actualReceived - expected;
        const issues = [];
        if (delta !== 0) {
            issues.push('payment_mismatch');
        }

        const payout = new Payout({
            userId: req.user.userId,
            platform,
            period,
            platformStatement,
            actualReceived,
            verified: delta === 0,
            delta,
            issues
        });

        await payout.save();
        console.log('Saved Payout');

        // Create Anomaly if Mismatch
        if (delta !== 0) {
            const anomaly = new Anomaly({
                userId: req.user.userId,
                type: 'payment_delta',
                details: { expected, actual: actualReceived, delta },
                score: Math.abs(delta), // Magnitude of error
                reasons: ['Payment mismatch detected']
            });
            await anomaly.save();
            console.log('Saved Anomaly');
        }

        res.json({
            verified: payout.verified,
            expected,
            delta,
            issues
        });
    } catch (error) {
        console.error('submitPayout Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getPayouts = async (req, res) => {
    console.log('getPayouts called for user:', req.params.userId);
    try {
        const payouts = await Payout.find({ userId: req.params.userId }).sort({ period: -1 });
        console.log('Found payouts items:', payouts.length);
        res.json({ items: payouts });
    } catch (error) {
        console.error('getPayouts Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
