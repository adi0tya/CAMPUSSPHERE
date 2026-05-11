const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

// @route POST /api/attendance/mark
exports.markAttendance = async (req, res, next) => {
  try {
    const { records, subjectId, date, semester } = req.body;
    // records: [{ studentId, status }]

    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty profile not found' });

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const ops = records.map(r => ({
      updateOne: {
        filter: { student: r.studentId, subject: subjectId, date: attendanceDate },
        update: { $set: { student: r.studentId, subject: subjectId, faculty: faculty._id, date: attendanceDate, status: r.status, semester } },
        upsert: true
      }
    }));

    await Attendance.bulkWrite(ops);
    res.status(200).json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) { next(error); }
};

// @route GET /api/attendance
exports.getAttendance = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.student) filter.student = req.query.student;
    if (req.query.date) {
      const d = new Date(req.query.date);
      d.setHours(0, 0, 0, 0);
      filter.date = d;
    }
    if (req.query.semester) filter.semester = parseInt(req.query.semester);

    const attendance = await Attendance.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('subject', 'name code')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } })
      .sort({ date: -1 });

    res.status(200).json({ success: true, attendance });
  } catch (error) { next(error); }
};

// @route GET /api/attendance/student/:studentId
exports.getStudentAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId })
      .populate('subject', 'name code')
      .sort({ date: -1 });

    // Calculate percentage per subject
    const subjectMap = {};
    attendance.forEach(a => {
      const key = a.subject?._id?.toString();
      if (!key) return;
      if (!subjectMap[key]) {
        subjectMap[key] = { subject: a.subject, total: 0, present: 0, absent: 0, late: 0 };
      }
      subjectMap[key].total++;
      subjectMap[key][a.status]++;
    });

    const summary = Object.values(subjectMap).map(s => ({
      ...s,
      percentage: s.total > 0 ? ((s.present + s.late) / s.total * 100).toFixed(1) : 0
    }));

    res.status(200).json({ success: true, attendance, summary });
  } catch (error) { next(error); }
};

// @route GET /api/attendance/my
exports.getMyAttendance = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const attendance = await Attendance.find({ student: student._id })
      .populate('subject', 'name code')
      .sort({ date: -1 });

    const subjectMap = {};
    attendance.forEach(a => {
      const key = a.subject?._id?.toString();
      if (!key) return;
      if (!subjectMap[key]) {
        subjectMap[key] = { subject: a.subject, total: 0, present: 0, absent: 0, late: 0 };
      }
      subjectMap[key].total++;
      subjectMap[key][a.status]++;
    });

    const summary = Object.values(subjectMap).map(s => ({
      ...s,
      percentage: s.total > 0 ? ((s.present + s.late) / s.total * 100).toFixed(1) : 0
    }));

    res.status(200).json({ success: true, attendance, summary });
  } catch (error) { next(error); }
};

// @route GET /api/attendance/report
exports.getAttendanceReport = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.semester) filter.semester = parseInt(req.query.semester);
    if (req.query.subject) filter.subject = req.query.subject;

    const report = await Attendance.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$student',
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          absent: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } },
          late: { $sum: { $cond: [{ $eq: ['$status', 'late'] }, 1, 0] } }
        }
      }
    ]);

    res.status(200).json({ success: true, report });
  } catch (error) { next(error); }
};
