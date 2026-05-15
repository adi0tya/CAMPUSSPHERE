const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect, restrictTo } = require('../middleware/authMiddleware'); // assuming restrictTo exists or I will add it

router.use(protect);
router.route('/').post(createComplaint).get(getComplaints);
router.put('/:id/status', updateComplaintStatus);

module.exports = router;
