const express = require('express');
const router = express.Router();
const { createFaculty, getFaculty, getFacultyById, getMyProfile, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/me', protect, authorize('faculty'), getMyProfile);
router.get('/', protect, authorize('admin', 'student'), getFaculty);
router.post('/', protect, authorize('admin'), createFaculty);
router.get('/:id', protect, getFacultyById);
router.put('/:id', protect, authorize('admin'), updateFaculty);
router.delete('/:id', protect, authorize('admin'), deleteFaculty);

module.exports = router;
