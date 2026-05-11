const Shipment = require('../models/Shipment');
const User = require('../models/User');
const Warehouse = require('../models/Warehouse');

exports.getShipmentReport = async (req, res, next) => {
  try {
    const { startDate, endDate, status } = req.query;
    const filter = {};
    if (startDate && endDate) filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    if (status) filter.status = status;

    const shipments = await Shipment.find(filter)
      .populate('assignedEmployee', 'name')
      .populate('assignedWarehouse', 'name city')
      .sort({ createdAt: -1 });

    const summary = {
      total: shipments.length,
      delivered: shipments.filter(s => s.status === 'delivered').length,
      failed: shipments.filter(s => s.status === 'failed').length,
      pending: shipments.filter(s => s.status === 'pending').length,
      inTransit: shipments.filter(s => s.status === 'in_transit').length
    };

    res.status(200).json({ success: true, shipments, summary });
  } catch (error) { next(error); }
};

exports.getEmployeePerformance = async (req, res, next) => {
  try {
    const employees = await User.find({ role: 'employee' });
    const performance = await Promise.all(employees.map(async (emp) => {
      const total = await Shipment.countDocuments({ assignedEmployee: emp._id });
      const delivered = await Shipment.countDocuments({ assignedEmployee: emp._id, status: 'delivered' });
      const failed = await Shipment.countDocuments({ assignedEmployee: emp._id, status: 'failed' });
      return {
        _id: emp._id, name: emp.name, email: emp.email, employeeType: emp.employeeType,
        total, delivered, failed, successRate: total > 0 ? ((delivered / total) * 100).toFixed(1) : 0
      };
    }));
    res.status(200).json({ success: true, performance });
  } catch (error) { next(error); }
};

exports.getWarehousePerformance = async (req, res, next) => {
  try {
    const warehouses = await Warehouse.find();
    const performance = await Promise.all(warehouses.map(async (wh) => {
      const total = await Shipment.countDocuments({ assignedWarehouse: wh._id });
      const delivered = await Shipment.countDocuments({ assignedWarehouse: wh._id, status: 'delivered' });
      const active = await Shipment.countDocuments({ assignedWarehouse: wh._id, status: { $nin: ['delivered', 'failed', 'returned'] } });
      return { _id: wh._id, name: wh.name, city: wh.city, total, delivered, active };
    }));
    res.status(200).json({ success: true, performance });
  } catch (error) { next(error); }
};

exports.getOverviewStats = async (req, res, next) => {
  try {
    const totalShipments = await Shipment.countDocuments();
    const totalEmployees = await User.countDocuments({ role: 'employee' });
    const totalWarehouses = await Warehouse.countDocuments();
    const totalDrivers = await User.countDocuments({ role: 'employee', employeeType: 'driver' });
    const deliveredCount = await Shipment.countDocuments({ status: 'delivered' });
    const activeDeliveries = await Shipment.countDocuments({ status: { $in: ['in_transit', 'out_for_delivery'] } });

    res.status(200).json({
      success: true,
      stats: { totalShipments, totalEmployees, totalWarehouses, totalDrivers, deliveredCount, activeDeliveries }
    });
  } catch (error) { next(error); }
};
