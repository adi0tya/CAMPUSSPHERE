const express = require('express');
const router = express.Router();
const { addBook, getBooks, requestBookIssue, getIssues, updateIssueStatus } = require('../controllers/libraryController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.route('/books').post(addBook).get(getBooks);
router.route('/issues').post(requestBookIssue).get(getIssues);
router.put('/issues/:id/status', updateIssueStatus);

module.exports = router;
