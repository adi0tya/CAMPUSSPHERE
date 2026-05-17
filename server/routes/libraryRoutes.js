const express = require('express');
const router = express.Router();
const { addBook, getBooks, requestBookIssue, getIssues, updateIssueStatus } = require('../controllers/libraryController');
const { protect } = require('../middleware/authMiddleware');
const { cacheRoute } = require('../middleware/cacheMiddleware');

router.use(protect);
router.route('/books').post(addBook).get(cacheRoute(300), getBooks);
router.route('/issues').post(requestBookIssue).get(cacheRoute(60), getIssues);
router.put('/issues/:id/status', updateIssueStatus);

module.exports = router;
