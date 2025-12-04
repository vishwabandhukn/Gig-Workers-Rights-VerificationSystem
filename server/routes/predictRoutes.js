const express = require('express');
const router = express.Router();
const predictController = require('../controllers/predictController');
const auth = require('../middleware/auth');

router.post('/suspension', auth, predictController.predictSuspension);
router.get('/history/:userId', auth, predictController.getHistory);

module.exports = router;
