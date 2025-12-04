const genAI = require('../config/gemini');
const RiskAssessment = require('../models/RiskAssessment');
const Anomaly = require('../models/Anomaly');

exports.predictSuspension = async (req, res) => {
    console.log('predictSuspension called');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    console.log('Body:', req.body);
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'User not authenticated properly' });
        }
        const { recentStats } = req.body;

        if (!recentStats) {
            console.error('Missing recentStats in body');
            return res.status(400).json({ message: 'Missing recentStats' });
        }

        console.log('Gemini Key Present:', !!process.env.GEMINI_API_KEY);

        console.log('Gemini Key Present:', !!process.env.GEMINI_API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
SYSTEM:
You are a gig-platform risk assessor. RETURN ONLY valid JSON: { "riskLevel":"low|medium|high", "score":0.00, "reasons":[...], "mitigation":[...] }.

USER:
Stats: ${JSON.stringify(recentStats)}
Instruction: Evaluate suspension risk and return JSON only. Provide up to 3 reasons and 3 short mitigation tips.
    `;

        let text = '';
        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            text = response.text();
            console.log('Gemini Response:', text);
        } catch (geminiError) {
            console.error('Gemini API Error:', geminiError);
            // Fallback if API fails
            text = JSON.stringify({
                riskLevel: "unknown",
                score: 0,
                reasons: ["AI Service Unavailable", geminiError.message],
                mitigation: ["Please try again later"]
            });
        }

        let prediction;
        try {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? jsonMatch[0] : text;
            prediction = JSON.parse(jsonStr);
        } catch (e) {
            console.error("LLM JSON Parse Error", e);
            prediction = { riskLevel: "unknown", score: 0, reasons: ["LLM Error"], mitigation: [] };
        }

        // Save Risk Assessment
        try {
            const assessment = new RiskAssessment({
                userId: req.user.userId,
                stats: recentStats,
                prediction
            });
            const savedAssessment = await assessment.save();
            console.log('Saved Assessment:', savedAssessment);
        } catch (dbError) {
            console.error('Database Save Error:', dbError);
            // Continue to return prediction even if save fails, but log it
        }

        // Create Anomaly if High Risk
        if (prediction.riskLevel === 'high') {
            try {
                const anomaly = new Anomaly({
                    userId: req.user.userId,
                    type: 'suspension_risk',
                    details: { riskLevel: prediction.riskLevel, score: prediction.score },
                    score: prediction.score,
                    reasons: prediction.reasons
                });
                await anomaly.save();
                console.log('Saved Anomaly');
            } catch (anomalyError) {
                console.error('Anomaly Save Error:', anomalyError);
            }
        }

        res.json(prediction);
    } catch (error) {
        console.error('predictSuspension Critical Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    console.log('getHistory called for user:', req.params.userId);
    try {
        const history = await RiskAssessment.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        console.log('Found history items:', history.length);
        res.json({ items: history });
    } catch (error) {
        console.error('getHistory Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
