const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');
const { cacheRoute } = require('../middleware/cacheMiddleware');

router.use(protect);
router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/history', cacheRoute(30), getHistory);

module.exports = router;
