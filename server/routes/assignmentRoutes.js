const express = require('express');
const router = express.Router();
const { createAssignment, getAssignments, submitAssignment, getSubmissions, getMySubmissions, deleteAssignment } = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/my-submissions', protect, authorize('student'), getMySubmissions);
router.get('/', protect, getAssignments);
router.post('/', protect, authorize('faculty'), createAssignment);
router.post('/:id/submit', protect, authorize('student'), submitAssignment);
router.get('/:id/submissions', protect, authorize('faculty', 'admin'), getSubmissions);
router.delete('/:id', protect, authorize('faculty', 'admin'), deleteAssignment);

module.exports = router;
