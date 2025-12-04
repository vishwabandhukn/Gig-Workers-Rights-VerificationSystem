const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const auth = require('../middleware/auth');

router.post('/', auth, tripController.createTrip);
router.get('/:userId', auth, tripController.getTrips);

module.exports = router;
