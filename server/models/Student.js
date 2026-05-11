const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rollNumber: { type: String, required: true, unique: true, trim: true },
  department: { type: String, required: true, trim: true },
  semester: { type: Number, required: true, min: 1, max: 10 },
  section: { type: String, trim: true, default: 'A' },
  admissionYear: { type: Number, required: true },
  parentName: { type: String, trim: true },
  address: { type: String, trim: true }
}, { timestamps: true });

studentSchema.index({ rollNumber: 1 });
studentSchema.index({ department: 1 });
studentSchema.index({ semester: 1 });

module.exports = mongoose.model('Student', studentSchema);
