const mongoose = require('mongoose');

const busPassSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute', required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Active', 'Expired', 'Rejected'],
    default: 'Pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending' 
  },
  passId: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('BusPass', busPassSchema);
