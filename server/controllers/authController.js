const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Admin register
// @route   POST /api/auth/admin/register
exports.adminRegister = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword, secretCode } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword || !secretCode) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (secretCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ success: false, message: 'Invalid admin secret code' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, phone, password, role: 'admin' });
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone }
    });
  } catch (error) { next(error); }
};

// @desc    Employee register
// @route   POST /api/auth/employee/register
exports.employeeRegister = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword, employeeType, vehicleNumber } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword || !employeeType) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    if (!['warehouse', 'driver'].includes(employeeType)) {
      return res.status(400).json({ success: false, message: 'Employee type must be warehouse or driver' });
    }

    if (employeeType === 'driver' && !vehicleNumber) {
      return res.status(400).json({ success: false, message: 'Vehicle number is required for drivers' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name, email, phone, password, role: 'employee', employeeType,
      vehicleNumber: employeeType === 'driver' ? vehicleNumber : undefined
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Employee account created successfully',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, employeeType: user.employeeType, phone: user.phone }
    });
  } catch (error) { next(error); }
};

// @desc    Admin login
// @route   POST /api/auth/admin/login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid admin credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid admin credentials' });

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      success: true, token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
    });
  } catch (error) { next(error); }
};

// @desc    Employee login
// @route   POST /api/auth/employee/login
exports.employeeLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email, role: 'employee' }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid employee credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid employee credentials' });

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Your account has been deactivated. Contact admin.' });

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    res.status(200).json({
      success: true, token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, employeeType: user.employeeType, avatar: user.avatar }
    });
  } catch (error) { next(error); }
};

// @desc    Create employee (admin only)
// @route   POST /api/auth/create-employee
exports.createEmployee = async (req, res, next) => {
  try {
    const { name, email, password, employeeType, phone, vehicleNumber } = req.body;
    if (!name || !email || !password || !employeeType) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, password, and employee type' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({
      name, email, password, role: 'employee', employeeType, phone,
      vehicleNumber: employeeType === 'driver' ? vehicleNumber : undefined
    });
    res.status(201).json({ success: true, message: 'Employee created successfully', user });
  } catch (error) { next(error); }
};

// @desc    Get current user
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, vehicleNumber } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (vehicleNumber) updateData.vehicleNumber = vehicleNumber;
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword;
    await user.save();
    const token = generateToken(user._id, user.role);
    res.status(200).json({ success: true, message: 'Password updated successfully', token });
  } catch (error) { next(error); }
};

// @desc    Logout
// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};
