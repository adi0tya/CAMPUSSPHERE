# 🎓 CampusSphere ERP

A full-fledged Campus & Organization Management System built with the MERN stack. Features a professional pure-black UI with role-based dashboards for Admin, Faculty, Student, and Accountant.

## ⚡ Quick Start

```bash
# Terminal 1 — Backend
cd server
npm install
node seed.js    # Optional: seed test data
npm run dev

# Terminal 2 — Frontend
cd client
npm install
npm run dev
```

Open **http://localhost:5173**

## 🔐 Test Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campussphere.com | admin123 |
| Accountant | accountant@campussphere.com | accountant123 |
| Faculty | priya@campussphere.com | faculty123 |
| Student | aditya@campussphere.com | student123 |

## 📋 Modules

- **Student Management** — CRUD, search, filter, pagination
- **Faculty Management** — CRUD, subject assignment
- **Course & Subject** — Department courses, semester subjects
- **Attendance** — Mark, view, report by subject
- **Notices** — Role-targeted announcements
- **Fees** — Payment tracking, receipts, reports
- **Assignments** — Create, submit, track deadlines
- **Timetable** — Class scheduling
- **Reports** — Analytics with charts + CSV export

## 🛠 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Chart.js, React Router, Axios
- **Backend:** Node.js, Express, MongoDB, JWT, bcrypt, multer
- **Theme:** Pure Black (#000000) with glassmorphism cards

## 🔑 Environment Variables

### server/.env
```
MONGO_URI=your_mongodb_uri/campussphere
JWT_SECRET=your_secret
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### client/.env
```
VITE_API_URL=http://localhost:5000
```

## 🚀 Deployment

| Service | Platform | Root Dir | Build | Start |
|---------|----------|----------|-------|-------|
| Backend | Render | `server` | `npm install` | `npm start` |
| Frontend | Vercel | `client` | `npm run build` | — |
