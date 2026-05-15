const Bus = require('../models/Bus');
const BusRoute = require('../models/BusRoute');
const BusPass = require('../models/BusPass');

exports.addBus = async (req, res, next) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({ success: true, bus });
  } catch (error) { next(error); }
};

exports.getBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find().populate('route');
    res.status(200).json({ success: true, buses });
  } catch (error) { next(error); }
};

exports.addRoute = async (req, res, next) => {
  try {
    const route = await BusRoute.create(req.body);
    res.status(201).json({ success: true, route });
  } catch (error) { next(error); }
};

exports.getRoutes = async (req, res, next) => {
  try {
    const routes = await BusRoute.find();
    res.status(200).json({ success: true, routes });
  } catch (error) { next(error); }
};

exports.applyForPass = async (req, res, next) => {
  try {
    const pass = await BusPass.create({
      user: req.user._id,
      route: req.body.route,
      validFrom: new Date(),
      validTo: new Date(new Date().setMonth(new Date().getMonth() + 6)), // 6 months validity
      passId: `PASS${Date.now()}`
    });
    res.status(201).json({ success: true, pass });
  } catch (error) { next(error); }
};

exports.getPasses = async (req, res, next) => {
  try {
    const filter = req.user.role === 'student' ? { user: req.user._id } : {};
    const passes = await BusPass.find(filter).populate('route').populate('user', 'name');
    res.status(200).json({ success: true, passes });
  } catch (error) { next(error); }
};

exports.updateLocation = async (req, res, next) => {
  try {
    const { busId, lat, lng } = req.body;
    const bus = await Bus.findByIdAndUpdate(busId, {
      currentLocation: { lat, lng, updatedAt: new Date() }
    }, { new: true });
    
    // In server.js, socket.io will emit this
    req.app.get('io').emit('busLocationUpdate', { busId, lat, lng });
    
    res.status(200).json({ success: true, bus });
  } catch (error) { next(error); }
};
