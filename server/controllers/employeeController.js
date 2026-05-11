const User = require('../models/User');
const Shipment = require('../models/Shipment');

exports.getEmployees = async (req, res, next) => {
  try {
    const filter = { role: 'employee' };
    if (req.query.employeeType) filter.employeeType = req.query.employeeType;
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    const employees = await User.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, employees });
  } catch (error) { next(error); }
};

exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    const totalAssigned = await Shipment.countDocuments({ assignedEmployee: employee._id });
    const delivered = await Shipment.countDocuments({ assignedEmployee: employee._id, status: 'delivered' });
    const failed = await Shipment.countDocuments({ assignedEmployee: employee._id, status: 'failed' });
    const active = await Shipment.countDocuments({ assignedEmployee: employee._id, status: { $nin: ['delivered', 'failed', 'returned'] } });
    res.status(200).json({ success: true, employee, performance: { totalAssigned, delivered, failed, active, successRate: totalAssigned > 0 ? ((delivered / totalAssigned) * 100).toFixed(1) : 0 } });
  } catch (error) { next(error); }
};

exports.updateEmployee = async (req, res, next) => {
  try {
    const { name, phone, employeeType, vehicleNumber, isActive } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (employeeType !== undefined) updateData.employeeType = employeeType;
    if (vehicleNumber !== undefined) updateData.vehicleNumber = vehicleNumber;
    if (isActive !== undefined) updateData.isActive = isActive;
    const employee = await User.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    res.status(200).json({ success: true, employee });
  } catch (error) { next(error); }
};

exports.toggleEmployeeStatus = async (req, res, next) => {
  try {
    const employee = await User.findById(req.params.id);
    if (!employee) return res.status(404).json({ success: false, message: 'Employee not found' });
    employee.isActive = !employee.isActive;
    await employee.save();
    res.status(200).json({ success: true, employee, message: `Employee ${employee.isActive ? 'activated' : 'deactivated'} successfully` });
  } catch (error) { next(error); }
};

exports.getDrivers = async (req, res, next) => {
  try {
    const drivers = await User.find({ role: 'employee', employeeType: 'driver', isActive: true });
    res.status(200).json({ success: true, drivers });
  } catch (error) { next(error); }
};
