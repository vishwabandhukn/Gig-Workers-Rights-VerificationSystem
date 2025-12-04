const express = require('express');
const router = express.Router();
const blackboxController = require('../controllers/blackboxController');
const auth = require('../middleware/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Note: Using auth middleware to get userId. Spec implies userId might be in params for GET, but POST usually authenticated.
// Spec: POST /api/blackbox/upload -> Form: file, tripId?, tags?
// Spec: GET /api/blackbox/:userId

router.post('/upload', auth, (req, res, next) => {
    console.log('Before Multer');
    next();
}, upload.single('file'), (req, res, next) => {
    console.log('After Multer');
    console.log('File in route:', req.file);
    next();
}, blackboxController.uploadEvidence);
router.get('/:userId', auth, blackboxController.getEvidence);

module.exports = router;
