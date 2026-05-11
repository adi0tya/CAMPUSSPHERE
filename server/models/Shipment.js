const mongoose = require('mongoose');

const shipmentHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  note: {
    type: String
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const shipmentSchema = new mongoose.Schema({
  trackingId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true
  },
  senderName: {
    type: String,
    required: [true, 'Sender name is required'],
    trim: true
  },
  senderPhone: {
    type: String,
    required: [true, 'Sender phone is required'],
    trim: true
  },
  senderAddress: {
    type: String,
    required: [true, 'Sender address is required'],
    trim: true
  },
  receiverName: {
    type: String,
    required: [true, 'Receiver name is required'],
    trim: true
  },
  receiverPhone: {
    type: String,
    required: [true, 'Receiver phone is required'],
    trim: true
  },
  receiverAddress: {
    type: String,
    required: [true, 'Receiver address is required'],
    trim: true
  },
  packageType: {
    type: String,
    enum: ['document', 'parcel', 'fragile', 'heavy', 'perishable', 'electronics'],
    default: 'parcel'
  },
  weight: {
    type: Number,
    min: [0.1, 'Weight must be at least 0.1 kg']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: [
      'pending',
      'picked_up',
      'received_at_warehouse',
      'in_transit',
      'out_for_delivery',
      'delivered',
      'failed',
      'returned'
    ],
    default: 'pending',
    index: true
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedWarehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Warehouse'
  },
  currentLocation: {
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  destinationLocation: {
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  },
  qrCode: {
    type: String
  },
  proofOfDelivery: {
    type: String
  },
  estimatedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  failureReason: {
    type: String
  },
  history: [shipmentHistorySchema]
}, {
  timestamps: true
});

// Indexes
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ assignedEmployee: 1 });
shipmentSchema.index({ assignedWarehouse: 1 });
shipmentSchema.index({ createdAt: -1 });
shipmentSchema.index({ trackingId: 'text', senderName: 'text', receiverName: 'text' });

module.exports = mongoose.model('Shipment', shipmentSchema);
