import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import {
  HiHome, HiClipboardDocumentList, HiDocumentText,
  HiCurrencyRupee, HiCalendarDays, HiBell, HiUserCircle
} from 'react-icons/hi2';

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard', icon: HiHome, exact: true },
  { path: '/student/attendance', label: 'My Attendance', icon: HiClipboardDocumentList },
  { path: '/student/assignments', label: 'Assignments', icon: HiDocumentText },
  { path: '/student/fees', label: 'My Fees', icon: HiCurrencyRupee },
  { path: '/student/timetable', label: 'Timetable', icon: HiCalendarDays },
  { path: '/student/notices', label: 'Notices', icon: HiBell },
  { path: '/student/profile', label: 'Profile', icon: HiUserCircle },
];

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black">
      <Sidebar links={studentLinks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 animate-fade-in"><Outlet /></main>
      </div>
    </div>
  );
};

export default StudentLayout;
