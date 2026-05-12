const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true, uppercase: true },
  department: { type: String, required: true, trim: true },
  duration: { type: Number, required: true, default: 4 }, // years
  semesters: { type: Number, required: true, default: 8 },
  description: { type: String, trim: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

courseSchema.index({ department: 1 });

module.exports = mongoose.model('Course', courseSchema);
