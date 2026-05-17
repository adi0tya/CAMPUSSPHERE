const LostFoundItem = require('../models/LostFoundItem');
const { invalidateCachePattern } = require('../middleware/cacheMiddleware');
const { publishEvent } = require('../utils/eventBus');

exports.reportItem = async (req, res, next) => {
  try {
    const item = await LostFoundItem.create({ ...req.body, user: req.user._id });
    await invalidateCachePattern('api/lost-found');
    publishEvent('lost_found_channel', { type: 'NEW_ITEM', data: item });
    res.status(201).json({ success: true, item });
  } catch (error) { next(error); }
};

exports.getItems = async (req, res, next) => {
  try {
    const items = await LostFoundItem.find().populate('user', 'name phone').sort('-date');
    res.status(200).json({ success: true, items });
  } catch (error) { next(error); }
};

exports.updateItemStatus = async (req, res, next) => {
  try {
    const item = await LostFoundItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await invalidateCachePattern('api/lost-found');
    publishEvent('lost_found_channel', { type: 'UPDATE_ITEM', data: item });
    res.status(200).json({ success: true, item });
  } catch (error) { next(error); }
};
