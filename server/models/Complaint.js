const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Electricity', 'Water', 'WiFi', 'Cleaning', 'Furniture', 'Mess'],
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending' 
  },
  images: [{ type: String }],
  assignedStaff: { type: String },
  resolution: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
