const Complaint = require('../models/Complaint');
const { invalidateCachePattern } = require('../middleware/cacheMiddleware');
const { publishEvent } = require('../utils/eventBus');

// @route POST /api/complaints
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, images } = req.body;
    const complaint = await Complaint.create({
      user: req.user._id,
      title,
      description,
      category,
      images
    });

    // Invalidate complaints cache
    await invalidateCachePattern('api/complaints');

    // Notify admins via Socket.io and Pub/Sub
    const io = req.app.get('io');
    if (io) io.emit('new_complaint', complaint);
    publishEvent('complaints_channel', { type: 'NEW_COMPLAINT', data: complaint });

    res.status(201).json({ success: true, complaint });
  } catch (error) { next(error); }
};

// @route GET /api/complaints
exports.getComplaints = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'student') filter.user = req.user._id;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, complaints });
  } catch (error) { next(error); }
};

// @route PUT /api/complaints/:id/status
exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, assignedStaff, resolution } = req.body;
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    if (status) complaint.status = status;
    if (assignedStaff) complaint.assignedStaff = assignedStaff;
    if (resolution) complaint.resolution = resolution;

    await complaint.save();

    // Invalidate complaints cache
    await invalidateCachePattern('api/complaints');

    // Notify student via Socket.io and Pub/Sub
    const io = req.app.get('io');
    if (io) io.emit(`complaint_updated_${complaint.user}`, complaint);
    publishEvent('complaints_channel', { type: 'UPDATE_COMPLAINT', data: complaint });

    res.status(200).json({ success: true, complaint });
  } catch (error) { next(error); }
};
