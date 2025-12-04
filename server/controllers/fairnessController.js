const User = require('../models/User');
const Payout = require('../models/Payout');
const Dispute = require('../models/Dispute');
const PlatformRating = require('../models/PlatformRating');
const RiskAssessment = require('../models/RiskAssessment');

exports.getFairnessScore = async (req, res) => {
    try {
        const userId = req.params.userId;

        // 1. Payment Component (40%)
        const payouts = await Payout.find({ userId });
        const totalPayouts = payouts.length;
        const verifiedPayouts = payouts.filter(p => p.verified).length;
        let paymentScore = totalPayouts === 0 ? 100 : (verifiedPayouts / totalPayouts) * 100;

        // 2. Suspension Component (25%)
        // Use latest RiskAssessment
        const latestRisk = await RiskAssessment.findOne({ userId }).sort({ createdAt: -1 });
        let suspensionScore = 100;
        if (latestRisk && latestRisk.prediction) {
            // High risk = low score. 
            // risk score is 0-1 (prob of suspension). 
            // If risk score is 0.8, fairness score is 20.
            // If prediction.score is 0-100, then 100 - score.
            // Assuming prediction.score is 0-1 or 0-100. Let's assume 0-1 from prompt "score":0.00
            const riskVal = latestRisk.prediction.score || 0;
            suspensionScore = 100 - (riskVal * 100);
            if (suspensionScore < 0) suspensionScore = 0;
        }

        // 3. Rating Component (20%)
        // Average of user's ratings for platforms
        const ratings = await PlatformRating.find({ userId });
        let ratingScore = 100; // Default if no ratings
        if (ratings.length > 0) {
            let totalSum = 0;
            let count = 0;
            ratings.forEach(r => {
                totalSum += (r.ratings.payment + r.ratings.suspension + r.ratings.support) / 3; // Avg of 3 fields (1-10)
                count++;
            });
            // Normalize 1-10 to 0-100
            const avgRating = totalSum / count;
            ratingScore = avgRating * 10;
        }

        // 4. Disputes Component (15%)
        const disputes = await Dispute.find({ userId });
        const totalDisputes = disputes.length;
        const resolvedDisputes = disputes.filter(d => d.status === 'resolved').length;
        // If no disputes, score is 100. If disputes exist, ratio of resolved.
        // But having disputes itself might lower score? 
        // Let's stick to "Resolution Rate".
        let disputesScore = totalDisputes === 0 ? 100 : (resolvedDisputes / totalDisputes) * 100;

        // Weights
        const finalScore = Math.round(
            (paymentScore * 0.4) +
            (suspensionScore * 0.25) +
            (ratingScore * 0.2) +
            (disputesScore * 0.15)
        );

        res.json({
            score: finalScore,
            components: {
                payment: Math.round(paymentScore),
                suspension: Math.round(suspensionScore),
                rating: Math.round(ratingScore),
                disputes: Math.round(disputesScore)
            },
            history: []
        });
    } catch (error) {
        console.error('Fairness Score Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
