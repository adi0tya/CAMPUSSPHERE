const Timetable = require('../models/Timetable');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');

// @route POST /api/timetable
exports.createTimetable = async (req, res, next) => {
  try {
    const entry = await Timetable.create(req.body);
    const populated = await Timetable.findById(entry._id)
      .populate('course', 'name code')
      .populate('subject', 'name code')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } });
    res.status(201).json({ success: true, timetable: populated });
  } catch (error) { next(error); }
};

// @route GET /api/timetable
exports.getTimetable = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    if (req.query.semester) filter.semester = parseInt(req.query.semester);
    if (req.query.faculty) filter.faculty = req.query.faculty;

    const timetable = await Timetable.find(filter)
      .populate('course', 'name code')
      .populate('subject', 'name code')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } })
      .sort({ day: 1, startTime: 1 });
    res.status(200).json({ success: true, timetable });
  } catch (error) { next(error); }
};

// @route GET /api/timetable/student/:studentId
exports.getStudentTimetable = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const timetable = await Timetable.find({ semester: student.semester })
      .populate('course', 'name code')
      .populate('subject', 'name code')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } })
      .sort({ day: 1, startTime: 1 });
    res.status(200).json({ success: true, timetable });
  } catch (error) { next(error); }
};

// @route GET /api/timetable/faculty/:facultyId
exports.getFacultyTimetable = async (req, res, next) => {
  try {
    const timetable = await Timetable.find({ faculty: req.params.facultyId })
      .populate('course', 'name code')
      .populate('subject', 'name code')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } })
      .sort({ day: 1, startTime: 1 });
    res.status(200).json({ success: true, timetable });
  } catch (error) { next(error); }
};

// @route GET /api/timetable/my
exports.getMyTimetable = async (req, res, next) => {
  try {
    let timetable = [];
    if (req.user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user: req.user._id });
      if (faculty) {
        timetable = await Timetable.find({ faculty: faculty._id })
          .populate('course', 'name code')
          .populate('subject', 'name code')
          .sort({ day: 1, startTime: 1 });
      }
    } else if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user._id });
      if (student) {
        timetable = await Timetable.find({ semester: student.semester })
          .populate('course', 'name code')
          .populate('subject', 'name code')
          .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } })
          .sort({ day: 1, startTime: 1 });
      }
    }
    res.status(200).json({ success: true, timetable });
  } catch (error) { next(error); }
};

// @route DELETE /api/timetable/:id
exports.deleteTimetable = async (req, res, next) => {
  try {
    const entry = await Timetable.findById(req.params.id);
    if (!entry) return res.status(404).json({ success: false, message: 'Timetable entry not found' });
    await entry.deleteOne();
    res.status(200).json({ success: true, message: 'Timetable entry deleted' });
  } catch (error) { next(error); }
};
