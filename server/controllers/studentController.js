const User = require('../models/User');
const Student = require('../models/Student');

// @route POST /api/students
exports.createStudent = async (req, res, next) => {
  try {
    const { name, email, phone, password, rollNumber, department, semester, section, admissionYear, parentName, address } = req.body;

    if (!name || !email || !password || !rollNumber || !department || !semester || !admissionYear) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const existingRoll = await Student.findOne({ rollNumber });
    if (existingRoll) return res.status(400).json({ success: false, message: 'Roll number already exists' });

    const user = await User.create({ name, email, phone, password: password || 'student123', role: 'student' });
    const student = await Student.create({ user: user._id, rollNumber, department, semester, section, admissionYear, parentName, address });

    const populated = await Student.findById(student._id).populate('user', 'name email phone isActive');
    res.status(201).json({ success: true, student: populated });
  } catch (error) { next(error); }
};

// @route GET /api/students
exports.getStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.semester) filter.semester = parseInt(req.query.semester);

    let userFilter = {};
    if (req.query.search) {
      userFilter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
      const matchingUsers = await User.find(userFilter).select('_id');
      filter.user = { $in: matchingUsers.map(u => u._id) };
    }

    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .populate('user', 'name email phone isActive avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      students,
      pagination: { current: page, pages: Math.ceil(total / limit), total, limit }
    });
  } catch (error) { next(error); }
};

// @route GET /api/students/:id
exports.getStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('user', 'name email phone isActive avatar');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.status(200).json({ success: true, student });
  } catch (error) { next(error); }
};

// @route GET /api/students/me
exports.getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name email phone avatar');
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
    res.status(200).json({ success: true, student });
  } catch (error) { next(error); }
};

// @route PUT /api/students/:id
exports.updateStudent = async (req, res, next) => {
  try {
    const { name, phone, department, semester, section, parentName, address } = req.body;

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    if (name || phone) {
      await User.findByIdAndUpdate(student.user, { ...(name && { name }), ...(phone && { phone }) });
    }

    const updateData = {};
    if (department) updateData.department = department;
    if (semester) updateData.semester = semester;
    if (section) updateData.section = section;
    if (parentName) updateData.parentName = parentName;
    if (address) updateData.address = address;

    const updated = await Student.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('user', 'name email phone isActive');
    res.status(200).json({ success: true, student: updated });
  } catch (error) { next(error); }
};

// @route DELETE /api/students/:id
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    await User.findByIdAndDelete(student.user);
    await student.deleteOne();
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) { next(error); }
};
