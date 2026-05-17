const Bus = require('../models/Bus');
const BusRoute = require('../models/BusRoute');
const BusPass = require('../models/BusPass');
const { invalidateCachePattern } = require('../middleware/cacheMiddleware');
const { redisClient } = require('../config/redis');

exports.addBus = async (req, res, next) => {
  try {
    const bus = await Bus.create(req.body);
    await invalidateCachePattern('api/buses');
    res.status(201).json({ success: true, bus });
  } catch (error) { next(error); }
};

exports.getBuses = async (req, res, next) => {
  try {
    let buses = await Bus.find().populate('route').lean();
    
    // Inject live locations from Redis
    buses = await Promise.all(buses.map(async (bus) => {
      const liveData = await redisClient.get(`bus_location_${bus._id}`);
      if (liveData) {
        bus.currentLocation = JSON.parse(liveData);
      }
      return bus;
    }));
    
    res.status(200).json({ success: true, buses });
  } catch (error) { next(error); }
};

exports.addRoute = async (req, res, next) => {
  try {
    const route = await BusRoute.create(req.body);
    await invalidateCachePattern('api/routes');
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
    await invalidateCachePattern('api/passes');
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
    
    const locationData = { lat, lng, updatedAt: new Date() };
    
    // Fast realtime update via Redis, auto-expire in 1 hour
    await redisClient.set(`bus_location_${busId}`, JSON.stringify(locationData), 'EX', 3600);
    
    // Background async update to MongoDB to avoid blocking
    Bus.findByIdAndUpdate(busId, { currentLocation: locationData }, { new: true }).catch(err => console.error(err));
    
    // Emit to clients via socket
    req.app.get('io').emit('busLocationUpdate', { busId, lat, lng });
    
    res.status(200).json({ success: true, message: 'Location updated in realtime cache' });
  } catch (error) { next(error); }
};

exports.updatePassStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const pass = await BusPass.findByIdAndUpdate(id, { status }, { new: true });
    await invalidateCachePattern('api/buses');
    res.status(200).json({ success: true, pass });
  } catch (error) { next(error); }
};
