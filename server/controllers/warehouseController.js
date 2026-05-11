const Warehouse = require('../models/Warehouse');
const Shipment = require('../models/Shipment');

exports.createWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.create(req.body);
    res.status(201).json({ success: true, warehouse });
  } catch (error) { next(error); }
};

exports.getWarehouses = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };
    if (req.query.isActive) filter.isActive = req.query.isActive === 'true';
    const warehouses = await Warehouse.find(filter).populate('manager', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, warehouses });
  } catch (error) { next(error); }
};

exports.getWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id).populate('manager', 'name email phone');
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found' });
    const incomingCount = await Shipment.countDocuments({ assignedWarehouse: warehouse._id, status: { $in: ['pending', 'picked_up'] } });
    const outgoingCount = await Shipment.countDocuments({ assignedWarehouse: warehouse._id, status: { $in: ['in_transit', 'out_for_delivery'] } });
    const storedCount = await Shipment.countDocuments({ assignedWarehouse: warehouse._id, status: 'received_at_warehouse' });
    res.status(200).json({ success: true, warehouse, shipmentStats: { incomingCount, outgoingCount, storedCount } });
  } catch (error) { next(error); }
};

exports.updateWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('manager', 'name email');
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found' });
    res.status(200).json({ success: true, warehouse });
  } catch (error) { next(error); }
};

exports.deleteWarehouse = async (req, res, next) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) return res.status(404).json({ success: false, message: 'Warehouse not found' });
    const activeShipments = await Shipment.countDocuments({ assignedWarehouse: warehouse._id, status: { $nin: ['delivered', 'returned', 'failed'] } });
    if (activeShipments > 0) return res.status(400).json({ success: false, message: `Cannot delete warehouse with ${activeShipments} active shipments` });
    await warehouse.deleteOne();
    res.status(200).json({ success: true, message: 'Warehouse deleted successfully' });
  } catch (error) { next(error); }
};
