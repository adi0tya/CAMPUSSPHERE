const express = require('express');
const router = express.Router();
const { createShipment, getShipments, getShipment, trackShipment, updateShipment, updateShipmentStatus, getAssignedShipments, scanShipment, getShipmentStats, deleteShipment, uploadProof } = require('../controllers/shipmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public
router.get('/track/:trackingId', trackShipment);

// Protected
router.get('/stats/overview', protect, authorize('admin'), getShipmentStats);
router.get('/employee/assigned', protect, authorize('employee'), getAssignedShipments);
router.get('/scan/:trackingId', protect, scanShipment);
router.get('/', protect, authorize('admin'), getShipments);
router.post('/', protect, authorize('admin'), createShipment);
router.get('/:id', protect, getShipment);
router.put('/:id', protect, authorize('admin'), updateShipment);
router.delete('/:id', protect, authorize('admin'), deleteShipment);
router.put('/:id/status', protect, authorize('employee'), updateShipmentStatus);
router.put('/:id/proof', protect, authorize('employee'), upload.single('proof'), uploadProof);

module.exports = router;
