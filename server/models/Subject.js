const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  semester: { type: Number, required: true, min: 1, max: 10 },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
  credits: { type: Number, default: 3 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

subjectSchema.index({ course: 1, semester: 1 });

module.exports = mongoose.model('Subject', subjectSchema);
