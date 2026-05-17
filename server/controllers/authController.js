const User = require('../models/User');
const OTP = require('../models/OTP');
const generateToken = require('../utils/generateToken');
const generateOTP = require('../utils/generateOTP');
const { addEmailJob } = require('../jobs/queueSetup');
const { redisClient } = require('../config/redis');

// Removed request-otp route

// @route POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword, role } = req.body;

    if (!name || !email || !phone || !password || !confirmPassword || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }



    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, phone, password, role });

    if (role === 'student') {
      const Student = require('../models/Student');
      await Student.create({
        user: user._id,
        rollNumber: `STU${Date.now().toString().slice(-6)}`,
        department: 'Unassigned',
        semester: 1,
        admissionYear: new Date().getFullYear(),
      });
    } else if (role === 'faculty') {
      const Faculty = require('../models/Faculty');
      await Faculty.create({
        user: user._id,
        employeeId: `FAC${Date.now().toString().slice(-6)}`,
        department: 'Unassigned',
      });
    }

    addEmailJob({
      email,
      subject: 'Welcome to CampusSphere ERP',
      message: `Hello ${name}, your account has been successfully created!`
    });

    const token = generateToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) { next(error); }
};

// @route POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ success: false, message: 'Missing fields' });

    const user = await User.findOne({ email, role }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) return res.status(403).json({ success: false, message: 'Account deactivated' });

    user.lastLogin = new Date();
    await user.save();

    addEmailJob({
      email,
      subject: 'New Login Detected',
      message: `A new login was detected on your CampusSphere account at ${new Date().toLocaleString()}.`
    });

    const token = generateToken(user._id, user.role);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) { next(error); }
};

// @route GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

// @route PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
};

// @route PUT /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) return res.status(401).json({ success: false, message: 'Current password incorrect' });
    
    user.password = newPassword;
    await user.save();
    
    const token = generateToken(user._id, user.role);
    res.status(200).json({ success: true, message: 'Password updated', token });
  } catch (error) { next(error); }
};

// Removed forgotPassword route

// @route POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) return res.status(400).json({ success: false, message: 'Email and new password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.password = newPassword;
    await user.save();

    addEmailJob({
      email,
      subject: 'Password Reset Successful',
      message: 'Your password has been reset successfully.'
    });

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) { next(error); }
};

// @route POST /api/auth/logout
exports.logout = async (req, res) => {
  const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
  if (token) {
    // Add token to blacklist in Redis, expires in 7 days (matching JWT expiry)
    await redisClient.set(`bl_${token}`, 'blacklisted', 'EX', 7 * 24 * 60 * 60);
  }
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out' });
};
