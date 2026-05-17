const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateStatus } = require('../controllers/roomServiceController');
const { protect } = require('../middleware/authMiddleware');
const { cacheRoute } = require('../middleware/cacheMiddleware');

router.use(protect);
router.route('/').post(createRequest).get(cacheRoute(60), getRequests);
router.get('/all', cacheRoute(60), getRequests);
router.put('/:id', updateStatus);
router.put('/:id/status', updateStatus);

module.exports = router;
