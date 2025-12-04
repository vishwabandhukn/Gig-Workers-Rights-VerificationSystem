const Evidence = require('../models/Evidence');
const cloudinary = require('../config/cloudinary');
const crypto = require('crypto');
const fs = require('fs');

exports.uploadEvidence = async (req, res) => {
    console.log('Upload Request Received');
    console.log('Headers:', req.headers);
    try {
        if (!req.file) {
            console.error('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log('File received:', req.file.path);

        const { tripId, tags } = req.body;
        const filePath = req.file.path;

        // Compute SHA-256
        const fileBuffer = fs.readFileSync(filePath);
        const hashSum = crypto.createHash('sha256');
        hashSum.update(fileBuffer);
        const sha256 = hashSum.digest('hex');
        console.log('SHA256 computed:', sha256);

        // Upload to Cloudinary
        console.log('Starting Cloudinary upload...');
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'gig_evidence',
            resource_type: 'auto'
        });
        console.log('Cloudinary upload success:', result.secure_url);

        // Clean up local file
        fs.unlinkSync(filePath);

        // Save to DB
        const evidence = new Evidence({
            userId: req.user.userId, // Assuming auth middleware is used
            tripId,
            s3Url: result.secure_url,
            sha256,
            tags: tags ? tags.split(',') : []
        });

        await evidence.save();
        console.log('Evidence saved to DB');

        res.status(201).json({
            evidenceId: evidence._id,
            sha256,
            s3Url: result.secure_url
        });
    } catch (error) {
        console.error('Upload Error:', error);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getEvidence = async (req, res) => {
    try {
        const items = await Evidence.find({ userId: req.params.userId }).sort({ timestamp: -1 });
        res.json({ items });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
