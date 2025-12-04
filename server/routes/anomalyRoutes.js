const express = require('express');
const router = express.Router();
const anomalyController = require('../controllers/anomalyController');
const auth = require('../middleware/auth');

router.get('/:userId', auth, anomalyController.getAnomalies);
router.post('/acknowledge', auth, anomalyController.acknowledgeAnomaly);

module.exports = router;
