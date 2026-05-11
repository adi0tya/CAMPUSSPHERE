const Course = require('../models/Course');
const Subject = require('../models/Subject');

// @route POST /api/courses
exports.createCourse = async (req, res, next) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ success: true, course });
  } catch (error) { next(error); }
};

// @route GET /api/courses
exports.getCourses = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  } catch (error) { next(error); }
};

// @route PUT /api/courses/:id
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.status(200).json({ success: true, course });
  } catch (error) { next(error); }
};

// @route DELETE /api/courses/:id
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    await course.deleteOne();
    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) { next(error); }
};

// @route POST /api/subjects
exports.createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create(req.body);
    const populated = await Subject.findById(subject._id)
      .populate('course', 'name code')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } });
    res.status(201).json({ success: true, subject: populated });
  } catch (error) { next(error); }
};

// @route GET /api/subjects
exports.getSubjects = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.course) filter.course = req.query.course;
    if (req.query.semester) filter.semester = parseInt(req.query.semester);
    if (req.query.faculty) filter.faculty = req.query.faculty;
    const subjects = await Subject.find(filter)
      .populate('course', 'name code department')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } })
      .sort({ semester: 1, name: 1 });
    res.status(200).json({ success: true, subjects });
  } catch (error) { next(error); }
};

// @route PUT /api/subjects/:id
exports.updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('course', 'name code')
      .populate({ path: 'faculty', populate: { path: 'user', select: 'name' } });
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    res.status(200).json({ success: true, subject });
  } catch (error) { next(error); }
};

// @route DELETE /api/subjects/:id
exports.deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ success: false, message: 'Subject not found' });
    await subject.deleteOne();
    res.status(200).json({ success: true, message: 'Subject deleted' });
  } catch (error) { next(error); }
};
