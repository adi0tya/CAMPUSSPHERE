const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware'); 
const { cacheRoute } = require('../middleware/cacheMiddleware');

router.use(protect);
router.route('/').post(createComplaint).get(cacheRoute(60), getComplaints);
router.put('/:id/status', updateComplaintStatus);

module.exports = router;
