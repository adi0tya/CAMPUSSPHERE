import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';

// Auth
import RoleSelection from './components/auth/RoleSelection';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import FacultyLayout from './layouts/FacultyLayout';
import StudentLayout from './layouts/StudentLayout';
import AccountantLayout from './layouts/AccountantLayout';

// Public Pages
import Home from './pages/public/Home';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import FacultyManagement from './pages/admin/FacultyManagement';
import CourseManagement from './pages/admin/CourseManagement';
import AttendanceReports from './pages/admin/AttendanceReports';
import NoticeManagement from './pages/admin/NoticeManagement';
import FeeReports from './pages/admin/FeeReports';
import TimetableManagement from './pages/admin/TimetableManagement';
import Reports from './pages/admin/Reports';
import AdminProfile from './pages/admin/AdminProfile';
import ComplaintManagement from './pages/admin/ComplaintManagement';
import LibraryManagement from './pages/admin/LibraryManagement';
import RoomServiceManagement from './pages/admin/RoomServiceManagement';
import BusManagement from './pages/admin/BusManagement';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import MySubjects from './pages/faculty/MySubjects';
import MarkAttendance from './pages/faculty/MarkAttendance';
import AssignmentManagement from './pages/faculty/AssignmentManagement';
import FacultyTimetable from './pages/faculty/MyTimetable';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyAttendance from './pages/student/MyAttendance';
import MyAssignments from './pages/student/MyAssignments';
import MyFees from './pages/student/MyFees';
import StudentTimetable from './pages/student/MyTimetable';
import HostelComplaints from './pages/student/HostelComplaints';
import LibrarySystem from './pages/student/LibrarySystem';
import RoomService from './pages/student/RoomService';
import BusTracking from './pages/student/BusTracking';

// Accountant Pages
import AccountantDashboard from './pages/accountant/AccountantDashboard';
import FeeManagement from './pages/accountant/FeeManagement';
import PaymentRecords from './pages/accountant/PaymentRecords';
import AccountantFeeReports from './pages/accountant/AccountantFeeReports';

// Shared Pages
import NoticesPage from './pages/shared/NoticesPage';
import ProfilePage from './pages/shared/ProfilePage';
import LostFound from './pages/shared/LostFound';

function App() {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/select-role" element={<RoleSelection />} />
      <Route path="/login/:role" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><RoleRoute role="admin"><AdminLayout /></RoleRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="faculty" element={<FacultyManagement />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="attendance" element={<AttendanceReports />} />
        <Route path="notices" element={<NoticeManagement />} />
        <Route path="fees" element={<FeeReports />} />
        <Route path="timetable" element={<TimetableManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="complaints" element={<ComplaintManagement />} />
        <Route path="library" element={<LibraryManagement />} />
        <Route path="room-service" element={<RoomServiceManagement />} />
        <Route path="buses" element={<BusManagement />} />
        <Route path="lost-found" element={<LostFound />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Faculty Routes */}
      <Route path="/faculty" element={<ProtectedRoute><RoleRoute role="faculty"><FacultyLayout /></RoleRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="subjects" element={<MySubjects />} />
        <Route path="attendance" element={<MarkAttendance />} />
        <Route path="assignments" element={<AssignmentManagement />} />
        <Route path="timetable" element={<FacultyTimetable />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute><RoleRoute role="student"><StudentLayout /></RoleRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<MyAttendance />} />
        <Route path="assignments" element={<MyAssignments />} />
        <Route path="fees" element={<MyFees />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="complaints" element={<HostelComplaints />} />
        <Route path="library" element={<LibrarySystem />} />
        <Route path="room-service" element={<RoomService />} />
        <Route path="bus" element={<BusTracking />} />
        <Route path="lost-found" element={<LostFound />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Accountant Routes */}
      <Route path="/accountant" element={<ProtectedRoute><RoleRoute role="accountant"><AccountantLayout /></RoleRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="/accountant/dashboard" replace />} />
        <Route path="dashboard" element={<AccountantDashboard />} />
        <Route path="fees" element={<FeeManagement />} />
        <Route path="payments" element={<PaymentRecords />} />
        <Route path="reports" element={<AccountantFeeReports />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
