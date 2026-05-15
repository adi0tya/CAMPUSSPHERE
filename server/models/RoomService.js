const mongoose = require('mongoose');

const roomServiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomNumber: { type: String, required: true },
  serviceType: { 
    type: String, 
    enum: ['Room cleaning', 'Laundry', 'Water can', 'Maintenance', 'Food delivery'],
    required: true 
  },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending' 
  },
  requestedTime: { type: Date, default: Date.now },
  scheduledTime: { type: Date },
  assignedStaff: { type: String },
  feedback: { type: String },
  rating: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('RoomService', roomServiceSchema);
