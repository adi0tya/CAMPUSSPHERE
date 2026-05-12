// CampusSphere ERP - Database Seeder
// Run: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Course = require('./models/Course');
const Subject = require('./models/Subject');
const Notice = require('./models/Notice');
const Fee = require('./models/Fee');

const connectDB = require('./config/db');

const seed = async () => {
  try {
    await connectDB();
    console.log('🌱 Seeding CampusSphere database...');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}), Student.deleteMany({}), Faculty.deleteMany({}),
      Course.deleteMany({}), Subject.deleteMany({}), Notice.deleteMany({}), Fee.deleteMany({})
    ]);

    // Create Admin
    const admin = await User.create({ name: 'Admin User', email: 'admin@campussphere.com', password: 'admin123', role: 'admin', phone: '9999999999', isActive: true });

    // Create Accountant
    const accountant = await User.create({ name: 'Ravi Sharma', email: 'accountant@campussphere.com', password: 'accountant123', role: 'accountant', phone: '8888888888', isActive: true });

    // Create Faculty Users
    const facultyUsers = await User.insertMany([
      { name: 'Dr. Priya Patel', email: 'priya@campussphere.com', password: await bcrypt.hash('faculty123', 12), role: 'faculty', phone: '7777777771', isActive: true },
      { name: 'Prof. Arjun Nair', email: 'arjun@campussphere.com', password: await bcrypt.hash('faculty123', 12), role: 'faculty', phone: '7777777772', isActive: true },
      { name: 'Dr. Sneha Gupta', email: 'sneha@campussphere.com', password: await bcrypt.hash('faculty123', 12), role: 'faculty', phone: '7777777773', isActive: true },
    ]);

    // Create Student Users
    const studentUsers = await User.insertMany([
      { name: 'Aditya Dash', email: 'aditya@campussphere.com', password: await bcrypt.hash('student123', 12), role: 'student', phone: '6666666661', isActive: true },
      { name: 'Ananya Roy', email: 'ananya@campussphere.com', password: await bcrypt.hash('student123', 12), role: 'student', phone: '6666666662', isActive: true },
      { name: 'Rohan Mehta', email: 'rohan@campussphere.com', password: await bcrypt.hash('student123', 12), role: 'student', phone: '6666666663', isActive: true },
      { name: 'Kavya Singh', email: 'kavya@campussphere.com', password: await bcrypt.hash('student123', 12), role: 'student', phone: '6666666664', isActive: true },
      { name: 'Vikram Reddy', email: 'vikram@campussphere.com', password: await bcrypt.hash('student123', 12), role: 'student', phone: '6666666665', isActive: true },
    ]);

    // Create Course
    const course = await Course.create({ name: 'B.Tech Computer Science', code: 'BTCS', department: 'Computer Science', duration: 4, semesters: 8 });

    // Create Faculty Profiles
    const faculties = await Faculty.insertMany([
      { user: facultyUsers[0]._id, employeeId: 'FAC-001', department: 'Computer Science', designation: 'Professor', subjects: [] },
      { user: facultyUsers[1]._id, employeeId: 'FAC-002', department: 'Computer Science', designation: 'Associate Professor', subjects: [] },
      { user: facultyUsers[2]._id, employeeId: 'FAC-003', department: 'Computer Science', designation: 'Assistant Professor', subjects: [] },
    ]);

    // Create Subjects
    const subjects = await Subject.insertMany([
      { name: 'Data Structures', code: 'CS201', course: course._id, semester: 3, faculty: faculties[0]._id },
      { name: 'Database Systems', code: 'CS301', course: course._id, semester: 5, faculty: faculties[1]._id },
      { name: 'Machine Learning', code: 'CS401', course: course._id, semester: 7, faculty: faculties[2]._id },
      { name: 'Web Development', code: 'CS302', course: course._id, semester: 5, faculty: faculties[0]._id },
      { name: 'Operating Systems', code: 'CS303', course: course._id, semester: 5, faculty: faculties[1]._id },
    ]);

    // Update faculty with subjects
    await Faculty.findByIdAndUpdate(faculties[0]._id, { $set: { subjects: [subjects[0]._id, subjects[3]._id] } });
    await Faculty.findByIdAndUpdate(faculties[1]._id, { $set: { subjects: [subjects[1]._id, subjects[4]._id] } });
    await Faculty.findByIdAndUpdate(faculties[2]._id, { $set: { subjects: [subjects[2]._id] } });

    // Create Student Profiles
    const students = await Student.insertMany([
      { user: studentUsers[0]._id, rollNumber: 'CS2022001', department: 'Computer Science', semester: 5, section: 'A', admissionYear: 2022, parentName: 'Mr. Dash', address: 'Bhubaneswar, Odisha' },
      { user: studentUsers[1]._id, rollNumber: 'CS2022002', department: 'Computer Science', semester: 5, section: 'A', admissionYear: 2022, parentName: 'Mr. Roy', address: 'Kolkata, West Bengal' },
      { user: studentUsers[2]._id, rollNumber: 'CS2022003', department: 'Computer Science', semester: 5, section: 'B', admissionYear: 2022, parentName: 'Mr. Mehta', address: 'Mumbai, Maharashtra' },
      { user: studentUsers[3]._id, rollNumber: 'CS2022004', department: 'Computer Science', semester: 5, section: 'B', admissionYear: 2022, parentName: 'Mr. Singh', address: 'Delhi' },
      { user: studentUsers[4]._id, rollNumber: 'CS2022005', department: 'Computer Science', semester: 5, section: 'A', admissionYear: 2022, parentName: 'Mr. Reddy', address: 'Hyderabad, Telangana' },
    ]);

    // Create Fee Records
    await Fee.insertMany([
      { student: students[0]._id, amount: 75000, paymentStatus: 'paid', dueDate: new Date('2026-06-30'), paidDate: new Date('2026-05-01'), receiptNumber: 'RCP-2026-001', description: 'Semester 5 Tuition Fee' },
      { student: students[1]._id, amount: 75000, paymentStatus: 'paid', dueDate: new Date('2026-06-30'), paidDate: new Date('2026-05-10'), receiptNumber: 'RCP-2026-002', description: 'Semester 5 Tuition Fee' },
      { student: students[2]._id, amount: 75000, paymentStatus: 'pending', dueDate: new Date('2026-06-30'), description: 'Semester 5 Tuition Fee' },
      { student: students[3]._id, amount: 75000, paymentStatus: 'pending', dueDate: new Date('2026-06-30'), description: 'Semester 5 Tuition Fee' },
      { student: students[4]._id, amount: 75000, paymentStatus: 'overdue', dueDate: new Date('2026-04-30'), description: 'Semester 5 Tuition Fee' },
    ]);

    // Create Notices
    await Notice.insertMany([
      { title: 'Semester Exam Schedule Released', description: 'The semester 5 examination schedule has been published. All students are requested to check the timetable and prepare accordingly. Exams begin from June 15, 2026.', targetRole: 'all', createdBy: admin._id },
      { title: 'Faculty Meeting - Monday', description: 'All faculty members are required to attend the departmental meeting on Monday at 10:00 AM in Conference Hall B.', targetRole: 'faculty', createdBy: admin._id },
      { title: 'Fee Payment Deadline Extended', description: 'The deadline for semester fee payment has been extended to June 30, 2026. Students with pending fees are requested to complete the payment at the earliest.', targetRole: 'student', createdBy: admin._id },
    ]);

    console.log('✅ Seed complete!');
    console.log('\n📋 Test Accounts:');
    console.log('  Admin:      admin@campussphere.com / admin123');
    console.log('  Accountant: accountant@campussphere.com / accountant123');
    console.log('  Faculty:    priya@campussphere.com / faculty123');
    console.log('  Student:    aditya@campussphere.com / student123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
};

seed();
