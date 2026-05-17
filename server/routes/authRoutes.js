const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, resetPassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, OTPRequestLimiter } = require('../middleware/rateLimitMiddleware');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/reset-password', authLimiter, resetPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', logout);

module.exports = router;
