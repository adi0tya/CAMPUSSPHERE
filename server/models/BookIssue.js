const mongoose = require('mongoose');

const bookIssueSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'LibraryBook', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: true },
  returnDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Pending Request', 'Issued', 'Returned', 'Overdue', 'Rejected'],
    default: 'Pending Request' 
  },
  fineAmount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('BookIssue', bookIssueSchema);
