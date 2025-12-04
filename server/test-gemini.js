const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Testing Gemini API Connection...');
console.log('API Key present:', !!process.env.GEMINI_API_KEY);

if (!process.env.GEMINI_API_KEY) {
    console.error('ERROR: GEMINI_API_KEY is missing in .env file');
    process.exit(1);
}

async function testConnection() {
    try {
        console.log('Listing available models via API...');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error('API Error listing models:', data.error);
            return;
        }

        console.log('Available Models:');
        if (data.models) {
            data.models.forEach(m => console.log(`- ${m.name}`));

            // Pick the first valid gemini model
            const validModel = data.models.find(m => m.name.includes('gemini') && m.supportedGenerationMethods.includes('generateContent'));

            if (validModel) {
                const modelName = validModel.name.replace('models/', '');
                console.log(`\nTesting with model: ${modelName}`);

                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = "Hello, are you working? Reply with 'Yes, I am working'.";
                const result = await model.generateContent(prompt);
                const response = await result.response;
                console.log('SUCCESS: Gemini Response received:', response.text());
            } else {
                console.error('No suitable Gemini model found.');
            }
        } else {
            console.log('No models returned.');
        }

    } catch (error) {
        console.error('FAILURE: Network/API Error:');
        console.error(error);
    }
}

testConnection();
