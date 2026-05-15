const express = require('express');
const router = express.Router();
const { addBus, getBuses, addRoute, getRoutes, applyForPass, getPasses, updateLocation } = require('../controllers/busController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/buses').post(addBus).get(getBuses);
router.route('/routes').post(addRoute).get(getRoutes);
router.route('/passes').post(applyForPass).get(getPasses);
router.put('/buses/location', updateLocation);

module.exports = router;
