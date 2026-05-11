const express = require('express');
const router = express.Router();
const { getOverviewStats, getAttendanceReport, getFeeReport, getStudentReport, getFacultyReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/overview', protect, authorize('admin'), getOverviewStats);
router.get('/attendance', protect, authorize('admin'), getAttendanceReport);
router.get('/fees', protect, authorize('admin', 'accountant'), getFeeReport);
router.get('/students', protect, authorize('admin'), getStudentReport);
router.get('/faculty', protect, authorize('admin'), getFacultyReport);

module.exports = router;
