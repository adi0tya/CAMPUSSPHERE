# CampusSphere ERP

A comprehensive Campus & Organization Management System built with MERN stack.

## 🎓 Features

### Multi-Role System
- **Admin**: Complete system management
- **Faculty**: Teaching and assessment management
- **Student**: Academic tracking and submissions
- **Accountant**: Financial management

### Core Modules
1. **Student Management** - Add, edit, view student profiles
2. **Faculty Management** - Manage teaching staff and assignments
3. **Course & Subject Management** - Organize academic structure
4. **Attendance Management** - Track and report attendance
5. **Notice Management** - Broadcast announcements
6. **Fee Management** - Handle payments and receipts
7. **Assignment Management** - Create and submit assignments
8. **Timetable Management** - Schedule classes and rooms
9. **Reports Dashboard** - Analytics and exports (CSV/PDF)

## 🚀 Tech Stack

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io (Real-time notifications)
- Multer (File uploads)
- PDFKit (PDF generation)
- json2csv (CSV exports)

### Frontend
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Chart.js (Data visualization)
- Axios
- React Hot Toast
- Socket.io Client

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Backend Setup

```bash
cd server
npm install
```

Create `.env` file in server directory:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campussphere
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
ADMIN_SECRET_CODE=CAMPUSSPHERE_ADMIN_2026
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Frontend Setup

```bash
cd client
npm install
```

Create `.env` file in client directory:

```env
VITE_API_URL=http://localhost:5000
```

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Build

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

## 🔐 Authentication

### Registration
- **Admin/Accountant**: Requires secret code (CAMPUSSPHERE_ADMIN_2026)
- **Faculty/Student**: Open registration

### Login
Users select their role and login with email/password.

### Default Credentials (After Seeding)
```
Admin:
Email: admin@campussphere.com
Password: admin123

Faculty:
Email: faculty@campussphere.com
Password: faculty123

Student:
Email: student@campussphere.com
Password: student123

Accountant:
Email: accountant@campussphere.com
Password: accountant123
```

## 📊 Database Seeding

To populate the database with sample data:

```bash
cd server
npm run seed
```

## 🎨 UI Theme

- **Background**: Pure black (#000000)
- **Cards**: #111111 / #181818
- **Borders**: #2a2a2a
- **Text**: White, gray, muted gray
- **Accent**: Cyan (#06b6d4) and Indigo (#6366f1)
- **Professional dark theme** optimized for long usage

## 📁 Project Structure

```
TrackSphere/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── layouts/       # Layout components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── config/       # Database config
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Auth & error middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── utils/        # Utility functions
│   │   └── server.js     # Entry point
│   ├── uploads/          # File uploads
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🌐 Deployment

### Backend (Render/Railway/Heroku)

1. Create new web service
2. Connect GitHub repository
3. Set environment variables
4. Deploy from `server` directory
5. Build command: `npm install`
6. Start command: `npm start`

### Frontend (Vercel/Netlify)

1. Create new project
2. Connect GitHub repository
3. Set build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Root directory: `client`
4. Add environment variable: `VITE_API_URL=<your-backend-url>`
5. Deploy

### MongoDB Atlas

1. Create cluster
2. Add database user
3. Whitelist IP (0.0.0.0/0 for production)
4. Get connection string
5. Update MONGO_URI in backend .env

## 🧪 Testing Checklist

- [ ] User registration (all roles)
- [ ] User login (all roles)
- [ ] Role-based dashboard access
- [ ] Student CRUD operations
- [ ] Faculty CRUD operations
- [ ] Course and subject management
- [ ] Attendance marking and viewing
- [ ] Notice creation and viewing
- [ ] Fee management and payment
- [ ] Assignment creation and submission
- [ ] Timetable creation and viewing
- [ ] Report generation (CSV/PDF)
- [ ] File upload functionality
- [ ] Real-time notifications
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Protected routes
- [ ] Token expiration handling
- [ ] Error handling

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Create student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Faculty
- `GET /api/faculty` - Get all faculty
- `POST /api/faculty` - Create faculty
- `GET /api/faculty/:id` - Get faculty by ID
- `PUT /api/faculty/:id` - Update faculty
- `DELETE /api/faculty/:id` - Delete faculty

### Courses & Subjects
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course
- `GET /api/subjects` - Get all subjects
- `POST /api/subjects` - Create subject

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance` - Get attendance records
- `GET /api/attendance/student/:id` - Get student attendance
- `GET /api/attendance/report` - Get attendance report

### Notices
- `GET /api/notices` - Get all notices
- `POST /api/notices` - Create notice
- `PUT /api/notices/:id` - Update notice
- `DELETE /api/notices/:id` - Delete notice

### Fees
- `GET /api/fees` - Get all fee records
- `POST /api/fees` - Create fee record
- `GET /api/fees/student/:id` - Get student fees
- `PATCH /api/fees/:id/status` - Update payment status

### Assignments
- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment
- `POST /api/assignments/:id/submit` - Submit assignment
- `GET /api/assignments/:id/submissions` - Get submissions

### Timetable
- `GET /api/timetable` - Get all timetable entries
- `POST /api/timetable` - Create timetable entry
- `GET /api/timetable/student/:id` - Get student timetable
- `GET /api/timetable/faculty/:id` - Get faculty timetable

### Reports
- `GET /api/reports/overview` - Get dashboard overview
- `GET /api/reports/attendance` - Export attendance report
- `GET /api/reports/fees` - Export fee report

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@campussphere.com or open an issue in the repository.

## 🎯 Roadmap

- [ ] Email notifications
- [ ] SMS integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Exam management module
- [ ] Library management
- [ ] Hostel management
- [ ] Transport management

---

**Built with ❤️ for educational institutions**
