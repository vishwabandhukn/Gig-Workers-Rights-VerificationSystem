const express = require('express');
const router = express.Router();
const fairnessController = require('../controllers/fairnessController');
const auth = require('../middleware/auth');

router.get('/:userId', auth, fairnessController.getFairnessScore);

module.exports = router;
