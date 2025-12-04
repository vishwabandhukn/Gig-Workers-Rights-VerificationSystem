const Anomaly = require('../models/Anomaly');

exports.getAnomalies = async (req, res) => {
    try {
        const anomalies = await Anomaly.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json({ items: anomalies });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.acknowledgeAnomaly = async (req, res) => {
    try {
        // Logic to acknowledge (maybe update status or delete?)
        // Spec: Response { ok: true }
        res.json({ ok: true });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
