const Fee = require('../models/Fee');
const Student = require('../models/Student');

const generateReceiptNumber = () => {
  const prefix = 'RCP';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// @route POST /api/fees
exports.createFee = async (req, res, next) => {
  try {
    const { student, amount, dueDate, description, semester, academicYear } = req.body;
    if (!student || !amount || !dueDate) {
      return res.status(400).json({ success: false, message: 'Student, amount and due date are required' });
    }
    const fee = await Fee.create({ student, amount, dueDate, description, semester, academicYear });
    const populated = await Fee.findById(fee._id).populate({ path: 'student', populate: { path: 'user', select: 'name email' } });
    res.status(201).json({ success: true, fee: populated });
  } catch (error) { next(error); }
};

// @route GET /api/fees
exports.getFees = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.paymentStatus) filter.paymentStatus = req.query.paymentStatus;
    if (req.query.semester) filter.semester = parseInt(req.query.semester);

    const fees = await Fee.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, fees });
  } catch (error) { next(error); }
};

// @route GET /api/fees/student/:studentId
exports.getStudentFees = async (req, res, next) => {
  try {
    const fees = await Fee.find({ student: req.params.studentId })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, fees });
  } catch (error) { next(error); }
};

// @route GET /api/fees/my
exports.getMyFees = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    const fees = await Fee.find({ student: student._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, fees });
  } catch (error) { next(error); }
};

// @route PATCH /api/fees/:id/status
exports.updateFeeStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;
    const updateData = { paymentStatus };
    if (paymentStatus === 'paid') {
      updateData.paidDate = new Date();
      updateData.receiptNumber = generateReceiptNumber();
    }
    const fee = await Fee.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } });
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });
    res.status(200).json({ success: true, fee });
  } catch (error) { next(error); }
};

// @route DELETE /api/fees/:id
exports.deleteFee = async (req, res, next) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });
    await fee.deleteOne();
    res.status(200).json({ success: true, message: 'Fee record deleted' });
  } catch (error) { next(error); }
};
