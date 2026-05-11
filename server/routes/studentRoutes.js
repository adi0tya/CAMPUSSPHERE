const express = require('express');
const router = express.Router();
const { createStudent, getStudents, getStudent, getMyProfile, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/me', protect, authorize('student'), getMyProfile);
router.get('/', protect, authorize('admin', 'faculty', 'accountant'), getStudents);
router.post('/', protect, authorize('admin'), createStudent);
router.get('/:id', protect, authorize('admin', 'faculty', 'accountant'), getStudent);
router.put('/:id', protect, authorize('admin'), updateStudent);
router.delete('/:id', protect, authorize('admin'), deleteStudent);

module.exports = router;
