const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const models = ["gemini-1.5-flash-001", "gemini-1.0-pro"];

        for (const modelName of models) {
            try {
                console.log(`Trying ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`${modelName} success:`, await result.response.text());
                return; // Stop if one works
            } catch (error) {
                console.error(`${modelName} failed:`, error.message);
            }
        }

    } catch (error) {
        console.error("Global error:", error);
    }
}

listModels();
