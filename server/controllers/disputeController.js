const Dispute = require('../models/Dispute');
const Evidence = require('../models/Evidence');
const User = require('../models/User');
const genAI = require('../config/gemini');

exports.createDispute = async (req, res) => {
    try {
        console.log('createDispute body:', req.body);
        const { title, evidenceIds, description, generateAppeal, platform, userName } = req.body;

        let appealLetter = null;

        if (generateAppeal) {
            // Fetch evidence details
            const evidenceList = await Evidence.find({ _id: { $in: evidenceIds } });
            const evidenceString = evidenceList.map(e => `${e._id} | ${e.tags.join(',')} | ${e.sha256} | ${e.s3Url} | Evidence`).join('\n');

            const user = await User.findById(req.user.userId);
            const nameToUse = userName || user.name;

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = `
SYSTEM:
You are a professional appeals writer for gig workers. Produce ONLY valid JSON with keys: "subject" (string), "body" (string), "summaryPoints" (array of strings). Body must be polite, factual, and explicitly reference evidence by id and sha256. Do NOT include meta commentary.

USER:
Platform: ${platform || 'Unknown'}
WorkerName: ${nameToUse}
UserId: ${req.user.userId}
IssueSummary: ${title} - ${description}
RequestedRemedy: Reinstatement and/or compensation
EvidenceLines:
${evidenceString}
Instructions:
- Cite evidence lines using evidence id and sha256.
- Include dates/times where applicable.
- Keep body <= 400 words.
Return ONLY a JSON object with keys subject, body, summaryPoints.
      `;

            console.log('Generating appeal with prompt:', prompt);
            try {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = response.text();
                console.log('Gemini response text:', text);

                // Extract JSON if wrapped in code blocks
                const jsonMatch = text.match(/\{[\s\S]*\}/);
                const jsonStr = jsonMatch ? jsonMatch[0] : text;
                appealLetter = JSON.parse(jsonStr);
            } catch (geminiError) {
                console.error("Gemini API Error (Using Fallback):", geminiError.message);

                // MOCK FALLBACK LOGIC
                const today = new Date().toLocaleDateString();
                const evidenceText = evidenceList.length > 0
                    ? `I have attached ${evidenceList.length} piece(s) of evidence to support my claim, including: ${evidenceList.map(e => e.tags.join(', ')).join(' and ')}.`
                    : "I can provide further evidence upon request.";

                appealLetter = {
                    subject: `Formal Appeal Regarding Account Status - ${platform} - ${nameToUse}`,
                    body: `To the ${platform} Appeals Team,\n\nI am writing to formally appeal the recent decision regarding my account (ID: ${req.user.userId}). I believe this decision was made in error and does not reflect my history of service on the platform.\n\nIssue Summary: ${title}\n\nDescription: ${description}\n\n${evidenceText}\n\nI respectfully request that you review this case and reinstate my account status. I am committed to following all platform guidelines and providing excellent service.\n\nSincerely,\n${nameToUse}\n${today}`,
                    summaryPoints: [
                        "Decision contested based on provided evidence.",
                        "Requesting immediate review and reinstatement.",
                        "Committed to platform guidelines."
                    ]
                };
            }
        }

        const dispute = new Dispute({
            userId: req.user.userId,
            title,
            evidenceIds,
            description,
            appealLetter: JSON.stringify(appealLetter),
            status: 'open'
        });

        await dispute.save();

        res.status(201).json({
            disputeId: dispute._id,
            appealLetter
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getDisputes = async (req, res) => {
    try {
        const disputes = await Dispute.find({ userId: req.params.userId }).sort({ createdAt: -1 });
        res.json({ items: disputes });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
