const User = require('../models/User');
const Faculty = require('../models/Faculty');

// @route POST /api/faculty
exports.createFaculty = async (req, res, next) => {
  try {
    const { name, email, phone, password, employeeId, department, designation } = req.body;

    if (!name || !email || !employeeId || !department) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'Email already registered' });

    const existingEmp = await Faculty.findOne({ employeeId });
    if (existingEmp) return res.status(400).json({ success: false, message: 'Employee ID already exists' });

    const user = await User.create({ name, email, phone, password: password || 'faculty123', role: 'faculty' });
    const faculty = await Faculty.create({ user: user._id, employeeId, department, designation });

    const populated = await Faculty.findById(faculty._id)
      .populate('user', 'name email phone isActive')
      .populate('subjects', 'name code');
    res.status(201).json({ success: true, faculty: populated });
  } catch (error) { next(error); }
};

// @route GET /api/faculty
exports.getFaculty = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;

    if (req.query.search) {
      const matchingUsers = await User.find({
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ]
      }).select('_id');
      filter.user = { $in: matchingUsers.map(u => u._id) };
    }

    const faculty = await Faculty.find(filter)
      .populate('user', 'name email phone isActive avatar')
      .populate('subjects', 'name code')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, faculty });
  } catch (error) { next(error); }
};

// @route GET /api/faculty/:id
exports.getFacultyById = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
      .populate('user', 'name email phone isActive avatar')
      .populate('subjects', 'name code semester');
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.status(200).json({ success: true, faculty });
  } catch (error) { next(error); }
};

// @route GET /api/faculty/me
exports.getMyProfile = async (req, res, next) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id })
      .populate('user', 'name email phone avatar')
      .populate('subjects', 'name code semester');
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty profile not found' });
    res.status(200).json({ success: true, faculty });
  } catch (error) { next(error); }
};

// @route PUT /api/faculty/:id
exports.updateFaculty = async (req, res, next) => {
  try {
    const { name, phone, department, designation, subjects } = req.body;

    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });

    if (name || phone) {
      await User.findByIdAndUpdate(faculty.user, { ...(name && { name }), ...(phone && { phone }) });
    }

    const updateData = {};
    if (department) updateData.department = department;
    if (designation) updateData.designation = designation;
    if (subjects) updateData.subjects = subjects;

    const updated = await Faculty.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('user', 'name email phone isActive')
      .populate('subjects', 'name code');
    res.status(200).json({ success: true, faculty: updated });
  } catch (error) { next(error); }
};

// @route DELETE /api/faculty/:id
exports.deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await Faculty.findById(req.params.id);
    if (!faculty) return res.status(404).json({ success: false, message: 'Faculty not found' });
    await User.findByIdAndDelete(faculty.user);
    await faculty.deleteOne();
    res.status(200).json({ success: true, message: 'Faculty deleted successfully' });
  } catch (error) { next(error); }
};
