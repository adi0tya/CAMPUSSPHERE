const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Notice = require('../models/Notice');
const Fee = require('../models/Fee');
const Attendance = require('../models/Attendance');

// @route GET /api/reports/overview
exports.getOverviewStats = async (req, res, next) => {
  try {
    const [totalStudents, totalFaculty, totalCourses, totalNotices] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Course.countDocuments({ isActive: true }),
      Notice.countDocuments({ isActive: true })
    ]);

    const feeStats = await Fee.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          paidAmount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$amount', 0] } },
          pendingAmount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'pending'] }, '$amount', 0] } },
          overdueAmount: { $sum: { $cond: [{ $eq: ['$paymentStatus', 'overdue'] }, '$amount', 0] } }
        }
      }
    ]);

    const attendanceStats = await Attendance.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }
        }
      }
    ]);

    const departments = await Student.distinct('department');

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        totalCourses,
        totalNotices,
        totalDepartments: departments.length,
        feeStats: feeStats[0] || { totalAmount: 0, paidAmount: 0, pendingAmount: 0, overdueAmount: 0 },
        attendanceStats: attendanceStats[0] || { total: 0, present: 0, absent: 0 }
      }
    });
  } catch (error) { next(error); }
};

// @route GET /api/reports/attendance
exports.getAttendanceReport = async (req, res, next) => {
  try {
    const report = await Attendance.aggregate([
      {
        $group: {
          _id: '$semester',
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json({ success: true, report });
  } catch (error) { next(error); }
};

// @route GET /api/reports/fees
exports.getFeeReport = async (req, res, next) => {
  try {
    const summary = await Fee.aggregate([
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      }
    ]);

    const monthly = await Fee.aggregate([
      { $match: { paymentStatus: 'paid' } },
      {
        $group: {
          _id: { month: { $month: '$paidDate' }, year: { $year: '$paidDate' } },
          amount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({ success: true, summary, monthly });
  } catch (error) { next(error); }
};

// @route GET /api/reports/students
exports.getStudentReport = async (req, res, next) => {
  try {
    const byDepartment = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const bySemester = await Student.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.status(200).json({ success: true, byDepartment, bySemester });
  } catch (error) { next(error); }
};

// @route GET /api/reports/faculty
exports.getFacultyReport = async (req, res, next) => {
  try {
    const byDepartment = await Faculty.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.status(200).json({ success: true, byDepartment });
  } catch (error) { next(error); }
};
