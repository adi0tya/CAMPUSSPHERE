const express = require('express');
const router = express.Router();
const { getShipmentReport, getEmployeePerformance, getWarehousePerformance, getOverviewStats } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/overview', protect, authorize('admin'), getOverviewStats);
router.get('/shipments', protect, authorize('admin'), getShipmentReport);
router.get('/employees', protect, authorize('admin'), getEmployeePerformance);
router.get('/warehouses', protect, authorize('admin'), getWarehousePerformance);

module.exports = router;
