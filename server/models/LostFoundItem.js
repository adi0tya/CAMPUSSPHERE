const mongoose = require('mongoose');

const lostFoundItemSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['Lost', 'Found'],
    required: true 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Electronics', 'Wallet', 'ID Card', 'Books', 'Accessories', 'Others'],
    required: true 
  },
  date: { type: Date, required: true, default: Date.now },
  location: { type: String, required: true },
  images: [{ type: String }],
  status: { 
    type: String, 
    enum: ['Open', 'Claimed', 'Resolved', 'Rejected'],
    default: 'Open' 
  },
  rewardAmount: { type: Number, default: 0 },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('LostFoundItem', lostFoundItemSchema);
