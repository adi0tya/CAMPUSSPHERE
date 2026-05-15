const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  capacity: { type: Number, required: true, default: 40 },
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'BusRoute' },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number },
    updatedAt: { type: Date }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Bus', busSchema);
