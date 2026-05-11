const express = require('express');
const router = express.Router();
const { adminLogin, employeeLogin, adminRegister, employeeRegister, createEmployee, getMe, updateProfile, changePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/admin/register', adminRegister);
router.post('/admin/login', adminLogin);
router.post('/employee/register', employeeRegister);
router.post('/employee/login', employeeLogin);
router.post('/create-employee', protect, authorize('admin'), createEmployee);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', logout);

module.exports = router;
