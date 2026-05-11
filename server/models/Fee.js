const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  amount: { type: Number, required: true, min: 0 },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'overdue', 'partial'],
    default: 'pending'
  },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  receiptNumber: { type: String, unique: true, sparse: true },
  description: { type: String, trim: true, default: 'Tuition Fee' },
  semester: { type: Number },
  academicYear: { type: String }
}, { timestamps: true });

feeSchema.index({ student: 1 });
feeSchema.index({ paymentStatus: 1 });
feeSchema.index({ dueDate: 1 });

module.exports = mongoose.model('Fee', feeSchema);
