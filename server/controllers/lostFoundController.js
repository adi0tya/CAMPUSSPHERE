const LostFoundItem = require('../models/LostFoundItem');

exports.reportItem = async (req, res, next) => {
  try {
    const item = await LostFoundItem.create({ ...req.body, user: req.user._id });
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
    res.status(200).json({ success: true, item });
  } catch (error) { next(error); }
};
