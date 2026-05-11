const express = require('express');
const router = express.Router();
const { createFee, getFees, getStudentFees, getMyFees, updateFeeStatus, deleteFee } = require('../controllers/feeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/my', protect, authorize('student'), getMyFees);
router.get('/student/:studentId', protect, authorize('admin', 'accountant'), getStudentFees);
router.get('/', protect, authorize('admin', 'accountant'), getFees);
router.post('/', protect, authorize('admin', 'accountant'), createFee);
router.patch('/:id/status', protect, authorize('admin', 'accountant'), updateFeeStatus);
router.delete('/:id', protect, authorize('admin', 'accountant'), deleteFee);

module.exports = router;
