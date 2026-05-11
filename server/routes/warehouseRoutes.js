const express = require('express');
const router = express.Router();
const { createWarehouse, getWarehouses, getWarehouse, updateWarehouse, deleteWarehouse } = require('../controllers/warehouseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('admin'), getWarehouses);
router.post('/', protect, authorize('admin'), createWarehouse);
router.get('/:id', protect, authorize('admin'), getWarehouse);
router.put('/:id', protect, authorize('admin'), updateWarehouse);
router.delete('/:id', protect, authorize('admin'), deleteWarehouse);

module.exports = router;
