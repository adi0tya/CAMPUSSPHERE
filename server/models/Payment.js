const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  purpose: { 
    type: String, 
    enum: ['Fee', 'Library Fine', 'Hostel Fine', 'Bus Pass', 'Room Service'],
    required: true 
  },
  referenceId: { type: mongoose.Schema.Types.ObjectId }, // e.g., BookIssue ID or BusPass ID
  status: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Pending' 
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  receiptNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
