const express = require('express');
const router = express.Router();
const { createRequest, getRequests, updateStatus } = require('../controllers/roomServiceController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').post(createRequest).get(getRequests);
router.put('/:id/status', updateStatus);

module.exports = router;
