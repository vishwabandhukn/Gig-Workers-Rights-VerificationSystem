const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/blackbox', require('./routes/blackboxRoutes'));
app.use('/api/payouts', require('./routes/payoutRoutes'));
app.use('/api/fairness', require('./routes/fairnessRoutes'));
app.use('/api/anomalies', require('./routes/anomalyRoutes'));
app.use('/api/platforms', require('./routes/platformRoutes'));
app.use('/api/disputes', require('./routes/disputeRoutes'));
app.use('/api/predict', require('./routes/predictRoutes'));
app.use('/api/export', require('./routes/exportRoutes'));








// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes Placeholder
app.get('/', (req, res) => {
    res.send('Gig Worker Rights API is running');
});

// Start Server
// Start Server
const PORT = 5050; // Hardcoded to resolve conflicts
console.log('DOTENV PORT (Ignored):', process.env.PORT);
console.log('Using PORT:', PORT);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
