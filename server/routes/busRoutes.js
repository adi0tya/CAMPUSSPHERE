const express = require('express');
const router = express.Router();
const { addBus, getBuses, addRoute, getRoutes, applyForPass, getPasses, updateLocation } = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');
const { cacheRoute } = require('../middleware/cacheMiddleware');

router.use(protect);
router.route('/buses').post(addBus).get(cacheRoute(120), getBuses);
router.route('/routes').post(addRoute).get(cacheRoute(120), getRoutes);
router.route('/passes').post(applyForPass).get(cacheRoute(60), getPasses);
router.put('/buses/location', updateLocation);

module.exports = router;
