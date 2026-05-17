const express = require('express');
const router = express.Router();
const { reportItem, getItems, updateItemStatus } = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');
const { cacheRoute } = require('../middleware/cacheMiddleware');

router.use(protect);
router.route('/').post(reportItem).get(cacheRoute(120), getItems);
router.put('/:id/status', updateItemStatus);

module.exports = router;
