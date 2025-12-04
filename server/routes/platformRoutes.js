const express = require('express');
const router = express.Router();
const platformRatingController = require('../controllers/platformRatingController');
const auth = require('../middleware/auth');

router.post('/rate', auth, platformRatingController.ratePlatform);
router.get('/user/:userId', auth, platformRatingController.getUserRatings);
router.get('/index', platformRatingController.getPlatformIndex); // Public? Spec doesn't say auth required for index, but let's assume public or auth. Spec: GET /api/platforms/index

module.exports = router;
