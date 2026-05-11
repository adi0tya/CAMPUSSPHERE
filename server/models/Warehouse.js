const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Warehouse name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  latitude: {
    type: Number,
    required: [true, 'Latitude is required']
  },
  longitude: {
    type: Number,
    required: [true, 'Longitude is required']
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  capacity: {
    type: Number,
    default: 1000
  },
  currentLoad: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  phone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

warehouseSchema.index({ city: 1 });
warehouseSchema.index({ isActive: 1 });

module.exports = mongoose.model('Warehouse', warehouseSchema);
