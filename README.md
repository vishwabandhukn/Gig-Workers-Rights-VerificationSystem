# Gig Worker Rights Platform

A comprehensive platform designed to empower gig workers by providing transparency, risk assessment, and dispute resolution tools. This application helps workers understand their standing on platforms like Uber, Lyft, and DoorDash, offering AI-driven insights and support.

## 🚀 Features

*   **Risk Assessment Dashboard**: Analyze your gig work statistics (cancellations, acceptance rate, ratings) to predict suspension risk.
    *   *Powered by AI (with robust offline fallback).*
*   **Dispute Resolution Center**: Generate professional appeal letters for unfair deactivations or payment issues.
    *   *AI-assisted drafting with template fallback.*
*   **Fairness Score**: Evaluate platforms based on transparency, pay, and worker treatment.
*   **Evidence Locker**: Securely upload and store screenshots and documents for disputes.
*   **Earnings & Payout Tracking**: Visualize your income and track payout history.
*   **Multi-Platform Support**: Manage profiles for multiple gig apps in one place.

## 🛠️ Tech Stack

### Client (Frontend)
*   **Framework**: React (Vite)
*   **Styling**: TailwindCSS, DaisyUI
*   **Animations**: Framer Motion
*   **Charts**: Chart.js, React-Chartjs-2
*   **Routing**: React Router DOM
*   **HTTP Client**: Axios

### Server (Backend)
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: MongoDB (Mongoose)
*   **Authentication**: JWT (JSON Web Tokens)
*   **AI Integration**: Google Gemini API (Generative AI)
*   **File Storage**: Cloudinary
*   **PDF Generation**: PDFKit

## 📦 Installation & Setup

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas URI)
*   Cloudinary Account (for image uploads)
*   Google Gemini API Key (optional, for AI features)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Hackthon
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5060
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the server:
```bash
npm run dev
```
*The server will run on port 5060 by default.*

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

Start the development server:
```bash
npm run dev
```
*The application will be available at `http://localhost:5173` (or similar).*

## 🛡️ Usage

1.  **Register/Login**: Create an account to secure your data.
2.  **Dashboard**: View your overall status and quick actions.
3.  **Risk Assessment**: Enter your recent stats to get a risk prediction.
4.  **Disputes**: Create a new dispute, upload evidence, and generate an appeal letter.
5.  **Evidence**: Upload screenshots of trips or chats to keep them safe.

## ⚠️ Important Notes

*   **Mock Fallback**: If the Gemini API key is missing or blocked, the application automatically switches to a robust mock mode, ensuring all features (Risk Assessment, Appeals) remain functional for demonstration purposes.
*   **Port Configuration**: The server is configured to run on port **5060** to avoid conflicts. Ensure your frontend proxy matches this port.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## 📄 License

This project is licensed under the MIT License.
