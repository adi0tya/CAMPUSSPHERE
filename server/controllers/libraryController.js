const LibraryBook = require('../models/LibraryBook');
const BookIssue = require('../models/BookIssue');

// @route POST /api/library/books
exports.addBook = async (req, res, next) => {
  try {
    const book = await LibraryBook.create(req.body);
    res.status(201).json({ success: true, book });
  } catch (error) { next(error); }
};

// @route GET /api/library/books
exports.getBooks = async (req, res, next) => {
  try {
    const filter = req.query.search ? { title: { $regex: req.query.search, $options: 'i' } } : {};
    const books = await LibraryBook.find(filter);
    res.status(200).json({ success: true, books });
  } catch (error) { next(error); }
};

// @route POST /api/library/issue
exports.requestBookIssue = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const book = await LibraryBook.findById(bookId);
    if (!book || book.availableCopies <= 0) return res.status(400).json({ success: false, message: 'Book not available' });

    const issue = await BookIssue.create({
      book: bookId,
      user: req.user._id,
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days
    });

    res.status(201).json({ success: true, issue });
  } catch (error) { next(error); }
};

// @route GET /api/library/issues
exports.getIssues = async (req, res, next) => {
  try {
    const filter = req.user.role === 'student' ? { user: req.user._id } : {};
    const issues = await BookIssue.find(filter).populate('book', 'title author coverImage').populate('user', 'name email');
    res.status(200).json({ success: true, issues });
  } catch (error) { next(error); }
};

// @route PUT /api/library/issues/:id/status
exports.updateIssueStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const issue = await BookIssue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Issue record not found' });

    issue.status = status;
    const book = await LibraryBook.findById(issue.book);

    if (status === 'Issued') {
      book.availableCopies -= 1;
    } else if (status === 'Returned') {
      book.availableCopies += 1;
      issue.returnDate = new Date();
      // Calculate fine if overdue (assume 10 rupees per day)
      if (issue.returnDate > issue.dueDate) {
        const days = Math.ceil((issue.returnDate - issue.dueDate) / (1000 * 60 * 60 * 24));
        issue.fineAmount = days * 10;
      }
    }

    await book.save();
    await issue.save();
    res.status(200).json({ success: true, issue });
  } catch (error) { next(error); }
};
