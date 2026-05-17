const RoomService = require('../models/RoomService');
const { invalidateCachePattern } = require('../middleware/cacheMiddleware');
const { publishEvent } = require('../utils/eventBus');

exports.createRequest = async (req, res, next) => {
  try {
    const service = await RoomService.create({ ...req.body, user: req.user._id });
    
    await invalidateCachePattern('api/room-service');
    publishEvent('room_service_channel', { type: 'NEW_REQUEST', data: service });
    
    res.status(201).json({ success: true, service });
  } catch (error) { next(error); }
};

exports.getRequests = async (req, res, next) => {
  try {
    const filter = req.user.role === 'student' ? { user: req.user._id } : {};
    const services = await RoomService.find(filter).populate('user', 'name roomNumber').sort('-createdAt');
    res.status(200).json({ success: true, services });
  } catch (error) { next(error); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const service = await RoomService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await invalidateCachePattern('api/room-service');
    publishEvent('room_service_channel', { type: 'UPDATE_REQUEST', data: service });
    
    res.status(200).json({ success: true, service });
  } catch (error) { next(error); }
};
