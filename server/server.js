require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const { createAdapter } = require('@socket.io/redis-adapter');
const { redisClient, redisSubscriber } = require('./config/redis');
const startEmailWorker = require('./workers/emailWorker');
const { apiLimiter } = require('./middleware/rateLimitMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const courseRoutes = require('./routes/courseRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const feeRoutes = require('./routes/feeRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const reportRoutes = require('./routes/reportRoutes');

// New route imports
const complaintRoutes = require('./routes/complaintRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const roomServiceRoutes = require('./routes/roomServiceRoutes');
const busRoutes = require('./routes/busRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Connect to MongoDB
connectDB().catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  process.exit(1);
});

const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  },
  adapter: createAdapter(redisClient, redisSubscriber)
});
app.set('io', io);

io.on('connection', (socket) => {
  console.log('User connected to sockets:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

const cookieParser = require('cookie-parser');

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api', apiLimiter); // Apply rate limiter to all API routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api', courseRoutes);          // /api/courses and /api/subjects
app.use('/api/attendance', attendanceRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/reports', reportRoutes);

// New Routes
app.use('/api/complaints', complaintRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/room-service', roomServiceRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CampusSphere ERP API is running', version: '3.0.0' });
});

// Error handler
app.use(errorHandler);

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🎓 CampusSphere ERP server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  
  // Start Workers
  startEmailWorker();
  console.log('⚙️ Background workers initialized');
});
