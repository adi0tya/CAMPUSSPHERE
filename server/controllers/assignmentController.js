const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Faculty = require('../models/Faculty');
const Student = require('../models/Student');

// @route POST /api/assignments
exports.createAssignment = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty profile not found' });

    const assignment = await Assignment.create({ ...req.body, faculty: faculty._id });
    const populated = await Assignment.findById(assignment._id)
      .populate('subject', 'name code')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } });
    res.status(201).json({ success: true, assignment: populated });
  } catch (error) { next(error); }
};

// @route GET /api/assignments
exports.getAssignments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.subject) filter.subject = req.query.subject;
    if (req.query.faculty) filter.faculty = req.query.faculty;
    if (req.query.semester) filter.semester = parseInt(req.query.semester);

    // Faculty sees their own assignments
    if (req.user.role === 'faculty') {
      const faculty = await Faculty.findOne({ user: req.user._id });
      if (faculty) filter.faculty = faculty._id;
    }

    const assignments = await Assignment.find(filter)
      .populate('subject', 'name code semester')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } })
      .sort({ deadline: 1 });
    res.status(200).json({ success: true, assignments });
  } catch (error) { next(error); }
};

// @route POST /api/assignments/:id/submit
exports.submitAssignment = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });

    const isLate = new Date() > new Date(assignment.deadline);

    const existing = await Submission.findOne({ assignment: req.params.id, student: student._id });
    if (existing) {
      existing.fileUrl = req.body.fileUrl || existing.fileUrl;
      existing.submittedAt = new Date();
      existing.status = isLate ? 'late' : 'submitted';
      await existing.save();
      return res.status(200).json({ success: true, submission: existing });
    }

    const submission = await Submission.create({
      assignment: req.params.id,
      student: student._id,
      fileUrl: req.body.fileUrl,
      status: isLate ? 'late' : 'submitted'
    });
    res.status(201).json({ success: true, submission });
  } catch (error) { next(error); }
};

// @route GET /api/assignments/:id/submissions
exports.getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.id })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort({ submittedAt: -1 });
    res.status(200).json({ success: true, submissions });
  } catch (error) { next(error); }
};

// @route GET /api/assignments/my-submissions
exports.getMySubmissions = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    const submissions = await Submission.find({ student: student._id })
      .populate({ path: 'assignment', populate: { path: 'subject', select: 'name code' } })
      .sort({ submittedAt: -1 });
    res.status(200).json({ success: true, submissions });
  } catch (error) { next(error); }
};

// @route DELETE /api/assignments/:id
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    await assignment.deleteOne();
    res.status(200).json({ success: true, message: 'Assignment deleted' });
  } catch (error) { next(error); }
};
