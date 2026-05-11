const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  deadline: { type: Date, required: true },
  fileUrl: { type: String },
  semester: { type: Number },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

assignmentSchema.index({ subject: 1 });
assignmentSchema.index({ faculty: 1 });
assignmentSchema.index({ deadline: 1 });

module.exports = mongoose.model('Assignment', assignmentSchema);
