const express = require('express');
const router = express.Router();
const { addBus, getBuses, addRoute, getRoutes, applyForPass, getPasses, updateLocation, updatePassStatus } = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');
const { cacheRoute } = require('../middleware/cacheMiddleware');

router.use(protect);
router.route('/').post(addBus).get(cacheRoute(120), getBuses);
router.route('/routes').post(addRoute).get(cacheRoute(120), getRoutes);
router.post('/apply-pass', applyForPass);
router.get('/my-pass', cacheRoute(60), getPasses);
router.get('/all-passes', cacheRoute(60), getPasses);
router.put('/pass/:id', updatePassStatus);
router.put('/location', updateLocation);

module.exports = router;
