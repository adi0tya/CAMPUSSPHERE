const mongoose = require('mongoose');

const busRouteSchema = new mongoose.Schema({
  routeName: { type: String, required: true, unique: true },
  stops: [{
    name: { type: String, required: true },
    arrivalTime: { type: String },
    lat: { type: Number },
    lng: { type: Number }
  }]
}, { timestamps: true });

module.exports = mongoose.model('BusRoute', busRouteSchema);
