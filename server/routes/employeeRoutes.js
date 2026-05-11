const express = require('express');
const router = express.Router();
const { getEmployees, getEmployee, updateEmployee, toggleEmployeeStatus, getDrivers } = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, authorize('admin'), getEmployees);
router.get('/drivers', protect, authorize('admin'), getDrivers);
router.get('/:id', protect, authorize('admin'), getEmployee);
router.put('/:id', protect, authorize('admin'), updateEmployee);
router.put('/:id/toggle-status', protect, authorize('admin'), toggleEmployeeStatus);

module.exports = router;
