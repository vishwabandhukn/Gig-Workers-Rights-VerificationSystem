const express = require('express');
const router = express.Router();
const disputeController = require('../controllers/disputeController');
const auth = require('../middleware/auth');

router.post('/create', auth, disputeController.createDispute);
router.get('/:userId', auth, disputeController.getDisputes);

module.exports = router;
