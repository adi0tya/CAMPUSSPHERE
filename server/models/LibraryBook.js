const mongoose = require('mongoose');

const libraryBookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, unique: true },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 },
  category: { type: String },
  coverImage: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('LibraryBook', libraryBookSchema);
