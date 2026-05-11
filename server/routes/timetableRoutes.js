const express = require('express');
const router = express.Router();
const { createTimetable, getTimetable, getStudentTimetable, getFacultyTimetable, getMyTimetable, deleteTimetable } = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/my', protect, getMyTimetable);
router.get('/student/:studentId', protect, authorize('admin', 'faculty'), getStudentTimetable);
router.get('/faculty/:facultyId', protect, authorize('admin'), getFacultyTimetable);
router.get('/', protect, getTimetable);
router.post('/', protect, authorize('admin'), createTimetable);
router.delete('/:id', protect, authorize('admin'), deleteTimetable);

module.exports = router;
