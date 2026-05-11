const express = require('express');
const router = express.Router();
const { createCourse, getCourses, updateCourse, deleteCourse, createSubject, getSubjects, updateSubject, deleteSubject } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// Courses
router.get('/courses', protect, getCourses);
router.post('/courses', protect, authorize('admin'), createCourse);
router.put('/courses/:id', protect, authorize('admin'), updateCourse);
router.delete('/courses/:id', protect, authorize('admin'), deleteCourse);

// Subjects
router.get('/subjects', protect, getSubjects);
router.post('/subjects', protect, authorize('admin'), createSubject);
router.put('/subjects/:id', protect, authorize('admin'), updateSubject);
router.delete('/subjects/:id', protect, authorize('admin'), deleteSubject);

module.exports = router;
