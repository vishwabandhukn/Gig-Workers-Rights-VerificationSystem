const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payoutController');
const auth = require('../middleware/auth');

router.post('/submit', auth, payoutController.submitPayout);
router.get('/:userId', auth, payoutController.getPayouts);

module.exports = router;
