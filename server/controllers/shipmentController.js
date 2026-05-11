const Shipment = require('../models/Shipment');
const Notification = require('../models/Notification');
const generateTrackingId = require('../utils/generateTrackingId');
const generateQRCode = require('../utils/generateQRCode');

// @desc    Create shipment
// @route   POST /api/shipments
exports.createShipment = async (req, res, next) => {
  try {
    const trackingId = generateTrackingId();

    const qrCode = await generateQRCode({
      trackingId,
      type: 'shipment'
    });

    const shipment = await Shipment.create({
      ...req.body,
      trackingId,
      qrCode,
      history: [{
        status: 'pending',
        location: req.body.senderAddress,
        note: 'Shipment created',
        updatedBy: req.user._id,
        timestamp: new Date()
      }]
    });

    // Notify assigned employee if any
    if (shipment.assignedEmployee) {
      await Notification.create({
        user: shipment.assignedEmployee,
        title: 'New Shipment Assigned',
        message: `Shipment ${trackingId} has been assigned to you`,
        type: 'assignment',
        link: `/employee/assigned-shipments`
      });
    }

    const populated = await Shipment.findById(shipment._id)
      .populate('assignedEmployee', 'name email employeeType')
      .populate('assignedWarehouse', 'name city');

    res.status(201).json({
      success: true,
      shipment: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all shipments (admin)
// @route   GET /api/shipments
exports.getShipments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;
    if (req.query.assignedEmployee) filter.assignedEmployee = req.query.assignedEmployee;
    if (req.query.assignedWarehouse) filter.assignedWarehouse = req.query.assignedWarehouse;

    // Search
    if (req.query.search) {
      filter.$or = [
        { trackingId: { $regex: req.query.search, $options: 'i' } },
        { senderName: { $regex: req.query.search, $options: 'i' } },
        { receiverName: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Date range filter
    if (req.query.startDate && req.query.endDate) {
      filter.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate)
      };
    }

    const total = await Shipment.countDocuments(filter);
    const shipments = await Shipment.find(filter)
      .populate('assignedEmployee', 'name email employeeType phone')
      .populate('assignedWarehouse', 'name city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      shipments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single shipment
// @route   GET /api/shipments/:id
exports.getShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('assignedEmployee', 'name email employeeType phone currentLocation')
      .populate('assignedWarehouse', 'name city address latitude longitude')
      .populate('history.updatedBy', 'name role');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      shipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track shipment by tracking ID (public)
// @route   GET /api/shipments/track/:trackingId
exports.trackShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({ trackingId: req.params.trackingId.toUpperCase() })
      .populate('assignedEmployee', 'name currentLocation')
      .populate('assignedWarehouse', 'name city')
      .populate('history.updatedBy', 'name');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found. Please check your tracking ID.'
      });
    }

    res.status(200).json({
      success: true,
      shipment: {
        trackingId: shipment.trackingId,
        status: shipment.status,
        senderName: shipment.senderName,
        receiverName: shipment.receiverName,
        receiverAddress: shipment.receiverAddress,
        packageType: shipment.packageType,
        weight: shipment.weight,
        priority: shipment.priority,
        currentLocation: shipment.currentLocation,
        estimatedDelivery: shipment.estimatedDelivery,
        deliveredAt: shipment.deliveredAt,
        history: shipment.history,
        assignedEmployee: shipment.status === 'out_for_delivery' ? {
          name: shipment.assignedEmployee?.name,
          currentLocation: shipment.assignedEmployee?.currentLocation
        } : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shipment
// @route   PUT /api/shipments/:id
exports.updateShipment = async (req, res, next) => {
  try {
    let shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    // If assigning new employee, notify them
    if (req.body.assignedEmployee && req.body.assignedEmployee !== shipment.assignedEmployee?.toString()) {
      await Notification.create({
        user: req.body.assignedEmployee,
        title: 'Shipment Assigned',
        message: `Shipment ${shipment.trackingId} has been assigned to you`,
        type: 'assignment',
        link: `/employee/assigned-shipments`
      });
    }

    shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate('assignedEmployee', 'name email employeeType')
      .populate('assignedWarehouse', 'name city');

    res.status(200).json({
      success: true,
      shipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update shipment status (employee)
// @route   PUT /api/shipments/:id/status
exports.updateShipmentStatus = async (req, res, next) => {
  try {
    const { status, location, note } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    shipment.status = status;

    if (location) {
      shipment.currentLocation = { address: location };
    }

    if (status === 'delivered') {
      shipment.deliveredAt = new Date();
    }

    if (status === 'failed' && req.body.failureReason) {
      shipment.failureReason = req.body.failureReason;
    }

    shipment.history.push({
      status,
      location: location || shipment.currentLocation?.address,
      note: note || `Status updated to ${status.replace(/_/g, ' ')}`,
      updatedBy: req.user._id,
      timestamp: new Date()
    });

    await shipment.save();

    const populated = await Shipment.findById(shipment._id)
      .populate('assignedEmployee', 'name email employeeType')
      .populate('assignedWarehouse', 'name city')
      .populate('history.updatedBy', 'name');

    res.status(200).json({
      success: true,
      shipment: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get employee's assigned shipments
// @route   GET /api/shipments/employee/assigned
exports.getAssignedShipments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { assignedEmployee: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const total = await Shipment.countDocuments(filter);
    const shipments = await Shipment.find(filter)
      .populate('assignedWarehouse', 'name city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      shipments,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shipment by QR / tracking ID
// @route   GET /api/shipments/scan/:trackingId
exports.scanShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findOne({
      trackingId: req.params.trackingId.toUpperCase()
    })
      .populate('assignedEmployee', 'name email employeeType')
      .populate('assignedWarehouse', 'name city')
      .populate('history.updatedBy', 'name');

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      shipment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shipment stats (admin dashboard)
// @route   GET /api/shipments/stats/overview
exports.getShipmentStats = async (req, res, next) => {
  try {
    const [stats] = await Shipment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          pickedUp: { $sum: { $cond: [{ $eq: ['$status', 'picked_up'] }, 1, 0] } },
          inTransit: { $sum: { $cond: [{ $eq: ['$status', 'in_transit'] }, 1, 0] } },
          outForDelivery: { $sum: { $cond: [{ $eq: ['$status', 'out_for_delivery'] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
          returned: { $sum: { $cond: [{ $eq: ['$status', 'returned'] }, 1, 0] } }
        }
      }
    ]);

    // Recent shipments
    const recentShipments = await Shipment.find()
      .populate('assignedEmployee', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Monthly stats for chart
    const monthlyStats = await Shipment.aggregate([
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' }
          },
          count: { $sum: 1 },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          failed: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      stats: stats || {
        total: 0, pending: 0, pickedUp: 0, inTransit: 0,
        outForDelivery: 0, delivered: 0, failed: 0, returned: 0
      },
      recentShipments,
      monthlyStats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete shipment
// @route   DELETE /api/shipments/:id
exports.deleteShipment = async (req, res, next) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    await shipment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Shipment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload proof of delivery
// @route   PUT /api/shipments/:id/proof
exports.uploadProof = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image'
      });
    }

    const shipment = await Shipment.findByIdAndUpdate(
      req.params.id,
      { proofOfDelivery: `/uploads/${req.file.filename}` },
      { new: true }
    );

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Shipment not found'
      });
    }

    res.status(200).json({
      success: true,
      shipment
    });
  } catch (error) {
    next(error);
  }
};
