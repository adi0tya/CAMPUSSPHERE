const express = require('express');
const router = express.Router();
const { reportItem, getItems, updateItemStatus } = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/').post(reportItem).get(getItems);
router.put('/:id/status', updateItemStatus);

module.exports = router;
