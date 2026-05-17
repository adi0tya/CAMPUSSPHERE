const express = require('express');
const router = express.Router();
const { addBook, getBooks, requestBookIssue, getIssues, updateIssueStatus } = require('../controllers/libraryController');
const { protect } = require('../middleware/authMiddleware');
const { cacheRoute } = require('../middleware/cacheMiddleware');

router.use(protect);
router.route('/books').post(addBook).get(cacheRoute(300), getBooks);

router.post('/issue', requestBookIssue); // Student applies
router.get('/my-issues', cacheRoute(60), getIssues); // Student views
router.get('/issues', cacheRoute(60), getIssues); // Admin views
router.put('/issue/:id/status', updateIssueStatus); // Admin updates

module.exports = router;
