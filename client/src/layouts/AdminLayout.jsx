import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import {
  HiHome, HiUsers, HiAcademicCap, HiBookOpen, HiClipboardDocumentList,
  HiBell, HiCurrencyRupee, HiCalendarDays, HiChartBar, HiUserCircle,
  HiWrenchScrewdriver, HiTruck, HiMagnifyingGlass, HiHomeModern
} from 'react-icons/hi2';

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: HiHome, exact: true },
  { path: '/admin/students', label: 'Students', icon: HiUsers },
  { path: '/admin/faculty', label: 'Faculty', icon: HiAcademicCap },
  { path: '/admin/courses', label: 'Courses & Subjects', icon: HiBookOpen },
  { path: '/admin/attendance', label: 'Attendance', icon: HiClipboardDocumentList },
  { path: '/admin/notices', label: 'Notices', icon: HiBell },
  { path: '/admin/fees', label: 'Fee Reports', icon: HiCurrencyRupee },
  { path: '/admin/timetable', label: 'Timetable', icon: HiCalendarDays },
  { path: '/admin/complaints', label: 'Complaints', icon: HiWrenchScrewdriver },
  { path: '/admin/library', label: 'Library', icon: HiBookOpen },
  { path: '/admin/room-service', label: 'Room Service', icon: HiHomeModern },
  { path: '/admin/buses', label: 'Bus Management', icon: HiTruck },
  { path: '/admin/lost-found', label: 'Lost & Found', icon: HiMagnifyingGlass },
  { path: '/admin/reports', label: 'Reports', icon: HiChartBar },
  { path: '/admin/profile', label: 'Profile', icon: HiUserCircle },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black">
      <Sidebar links={adminLinks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 animate-fade-in"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
