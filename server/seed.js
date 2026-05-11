require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Course = require('./models/Course');
const Subject = require('./models/Subject');
const Notice = require('./models/Notice');

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Student.deleteMany({});
    await Faculty.deleteMany({});
    await Course.deleteMany({});
    await Subject.deleteMany({});
    await Notice.deleteMany({});
    
    console.log('👤 Creating users...');
    
    // Create Admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@campussphere.com',
      password: 'admin123',
      role: 'admin',
      phone: '9876543210',
      isActive: true
    });
    
    // Create Accountant
    const accountant = await User.create({
      name: 'Accountant User',
      email: 'accountant@campussphere.com',
      password: 'accountant123',
      role: 'accountant',
      phone: '9876543211',
      isActive: true
    });
    
    // Create Faculty Users
    const facultyUser1 = await User.create({
      name: 'Dr. John Smith',
      email: 'john.smith@campussphere.com',
      password: 'faculty123',
      role: 'faculty',
      phone: '9876543212',
      isActive: true
    });
    
    const facultyUser2 = await User.create({
      name: 'Prof. Sarah Johnson',
      email: 'sarah.johnson@campussphere.com',
      password: 'faculty123',
      role: 'faculty',
      phone: '9876543213',
      isActive: true
    });
    
    const facultyUser3 = await User.create({
      name: 'Dr. Michael Brown',
      email: 'michael.brown@campussphere.com',
      password: 'faculty123',
      role: 'faculty',
      phone: '9876543214',
      isActive: true
    });
    
    // Create Student Users
    const studentUser1 = await User.create({
      name: 'Alice Williams',
      email: 'alice.williams@campussphere.com',
      password: 'student123',
      role: 'student',
      phone: '9876543215',
      isActive: true
    });
    
    const studentUser2 = await User.create({
      name: 'Bob Davis',
      email: 'bob.davis@campussphere.com',
      password: 'student123',
      role: 'student',
      phone: '9876543216',
      isActive: true
    });
    
    const studentUser3 = await User.create({
      name: 'Charlie Miller',
      email: 'charlie.miller@campussphere.com',
      password: 'student123',
      role: 'student',
      phone: '9876543217',
      isActive: true
    });
    
    const studentUser4 = await User.create({
      name: 'Diana Garcia',
      email: 'diana.garcia@campussphere.com',
      password: 'student123',
      role: 'student',
      phone: '9876543218',
      isActive: true
    });
    
    const studentUser5 = await User.create({
      name: 'Ethan Martinez',
      email: 'ethan.martinez@campussphere.com',
      password: 'student123',
      role: 'student',
      phone: '9876543219',
      isActive: true
    });
    
    console.log('📚 Creating courses...');
    
    const cseCourse = await Course.create({
      name: 'Computer Science Engineering',
      code: 'CSE',
      department: 'Engineering',
      duration: 4,
      semesters: 8
    });
    
    const eceCourse = await Course.create({
      name: 'Electronics & Communication Engineering',
      code: 'ECE',
      department: 'Engineering',
      duration: 4,
      semesters: 8
    });
    
    const mbaCourse = await Course.create({
      name: 'Master of Business Administration',
      code: 'MBA',
      department: 'Management',
      duration: 2,
      semesters: 4
    });
    
    console.log('📖 Creating subjects...');
    
    const subject1 = await Subject.create({
      name: 'Data Structures',
      code: 'CS201',
      course: cseCourse._id,
      semester: 3,
      credits: 4
    });
    
    const subject2 = await Subject.create({
      name: 'Database Management Systems',
      code: 'CS301',
      course: cseCourse._id,
      semester: 5,
      credits: 4
    });
    
    const subject3 = await Subject.create({
      name: 'Web Development',
      code: 'CS401',
      course: cseCourse._id,
      semester: 7,
      credits: 3
    });
    
    const subject4 = await Subject.create({
      name: 'Digital Electronics',
      code: 'EC201',
      course: eceCourse._id,
      semester: 3,
      credits: 4
    });
    
    const subject5 = await Subject.create({
      name: 'Marketing Management',
      code: 'MBA101',
      course: mbaCourse._id,
      semester: 1,
      credits: 3
    });
    
    console.log('👨‍🏫 Creating faculty profiles...');
    
    const faculty1 = await Faculty.create({
      user: facultyUser1._id,
      employeeId: 'FAC001',
      department: 'Computer Science',
      subjects: [subject1._id, subject2._id],
      designation: 'Professor',
      qualification: 'Ph.D. in Computer Science',
      experience: 15,
      joiningDate: new Date('2010-07-01')
    });
    
    const faculty2 = await Faculty.create({
      user: facultyUser2._id,
      employeeId: 'FAC002',
      department: 'Computer Science',
      subjects: [subject3._id],
      designation: 'Associate Professor',
      qualification: 'M.Tech in Software Engineering',
      experience: 10,
      joiningDate: new Date('2015-08-15')
    });
    
    const faculty3 = await Faculty.create({
      user: facultyUser3._id,
      employeeId: 'FAC003',
      department: 'Electronics',
      subjects: [subject4._id],
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in Electronics',
      experience: 8,
      joiningDate: new Date('2017-06-01')
    });
    
    // Update subjects with faculty
    await Subject.findByIdAndUpdate(subject1._id, { faculty: faculty1._id });
    await Subject.findByIdAndUpdate(subject2._id, { faculty: faculty1._id });
    await Subject.findByIdAndUpdate(subject3._id, { faculty: faculty2._id });
    await Subject.findByIdAndUpdate(subject4._id, { faculty: faculty3._id });
    
    console.log('👨‍🎓 Creating student profiles...');
    
    await Student.create({
      user: studentUser1._id,
      rollNumber: 'CSE2021001',
      course: cseCourse._id,
      department: 'Computer Science',
      semester: 5,
      section: 'A',
      admissionYear: 2021,
      parentName: 'Robert Williams',
      parentPhone: '9876543220',
      address: '123 Main St, City, State - 123456',
      bloodGroup: 'O+',
      dateOfBirth: new Date('2003-05-15')
    });
    
    await Student.create({
      user: studentUser2._id,
      rollNumber: 'CSE2021002',
      course: cseCourse._id,
      department: 'Computer Science',
      semester: 5,
      section: 'A',
      admissionYear: 2021,
      parentName: 'James Davis',
      parentPhone: '9876543221',
      address: '456 Oak Ave, City, State - 123456',
      bloodGroup: 'A+',
      dateOfBirth: new Date('2003-08-22')
    });
    
    await Student.create({
      user: studentUser3._id,
      rollNumber: 'CSE2022001',
      course: cseCourse._id,
      department: 'Computer Science',
      semester: 3,
      section: 'B',
      admissionYear: 2022,
      parentName: 'Thomas Miller',
      parentPhone: '9876543222',
      address: '789 Pine Rd, City, State - 123456',
      bloodGroup: 'B+',
      dateOfBirth: new Date('2004-03-10')
    });
    
    await Student.create({
      user: studentUser4._id,
      rollNumber: 'ECE2021001',
      course: eceCourse._id,
      department: 'Electronics',
      semester: 5,
      section: 'A',
      admissionYear: 2021,
      parentName: 'Carlos Garcia',
      parentPhone: '9876543223',
      address: '321 Elm St, City, State - 123456',
      bloodGroup: 'AB+',
      dateOfBirth: new Date('2003-11-05')
    });
    
    await Student.create({
      user: studentUser5._id,
      rollNumber: 'CSE2021003',
      course: cseCourse._id,
      department: 'Computer Science',
      semester: 5,
      section: 'A',
      admissionYear: 2021,
      parentName: 'Luis Martinez',
      parentPhone: '9876543224',
      address: '654 Maple Dr, City, State - 123456',
      bloodGroup: 'O-',
      dateOfBirth: new Date('2003-07-18')
    });
    
    console.log('📢 Creating notices...');
    
    await Notice.create({
      title: 'Welcome to CampusSphere ERP',
      description: 'Welcome to the new academic year! We are excited to have you on our campus management system.',
      targetRole: 'all',
      createdBy: admin._id,
      priority: 'high'
    });
    
    await Notice.create({
      title: 'Mid-Semester Examination Schedule',
      description: 'Mid-semester examinations will be conducted from 15th March to 25th March 2026. Please check your timetable for details.',
      targetRole: 'student',
      createdBy: admin._id,
      priority: 'high'
    });
    
    await Notice.create({
      title: 'Faculty Meeting - Department Heads',
      description: 'All department heads are requested to attend the faculty meeting on 10th March 2026 at 10:00 AM in the conference hall.',
      targetRole: 'faculty',
      createdBy: admin._id,
      priority: 'medium'
    });
    
    await Notice.create({
      title: 'Fee Payment Deadline',
      description: 'Last date for semester fee payment is 20th March 2026. Late fee will be applicable after the deadline.',
      targetRole: 'student',
      createdBy: accountant._id,
      priority: 'high'
    });
    
    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:');
    console.log('  Email: admin@campussphere.com');
    console.log('  Password: admin123');
    console.log('\nAccountant:');
    console.log('  Email: accountant@campussphere.com');
    console.log('  Password: accountant123');
    console.log('\nFaculty:');
    console.log('  Email: john.smith@campussphere.com');
    console.log('  Password: faculty123');
    console.log('\nStudent:');
    console.log('  Email: alice.williams@campussphere.com');
    console.log('  Password: student123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
