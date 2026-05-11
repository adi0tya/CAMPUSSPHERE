const Notice = require('../models/Notice');

// @route POST /api/notices
exports.createNotice = async (req, res, next) => {
  try {
    const { title, description, targetRole } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }
    const notice = await Notice.create({ title, description, targetRole: targetRole || 'all', createdBy: req.user._id });
    const populated = await Notice.findById(notice._id).populate('createdBy', 'name role');
    res.status(201).json({ success: true, notice: populated });
  } catch (error) { next(error); }
};

// @route GET /api/notices
exports.getNotices = async (req, res, next) => {
  try {
    const userRole = req.user.role;
    const filter = { isActive: true };

    // Non-admin users see notices targeted to them or 'all'
    if (userRole !== 'admin') {
      filter.$or = [{ targetRole: 'all' }, { targetRole: userRole }];
    }

    const notices = await Notice.find(filter)
      .populate('createdBy', 'name role')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, notices });
  } catch (error) { next(error); }
};

// @route PUT /api/notices/:id
exports.updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('createdBy', 'name role');
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    res.status(200).json({ success: true, notice });
  } catch (error) { next(error); }
};

// @route DELETE /api/notices/:id
exports.deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });
    await notice.deleteOne();
    res.status(200).json({ success: true, message: 'Notice deleted' });
  } catch (error) { next(error); }
};
