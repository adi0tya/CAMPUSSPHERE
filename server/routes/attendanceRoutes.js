const express = require('express');
const router = express.Router();
const { markAttendance, getAttendance, getStudentAttendance, getMyAttendance, getAttendanceReport } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/mark', protect, authorize('faculty'), markAttendance);
router.get('/my', protect, authorize('student'), getMyAttendance);
router.get('/report', protect, authorize('admin'), getAttendanceReport);
router.get('/student/:studentId', protect, authorize('admin', 'faculty'), getStudentAttendance);
router.get('/', protect, authorize('admin', 'faculty'), getAttendance);

module.exports = router;
