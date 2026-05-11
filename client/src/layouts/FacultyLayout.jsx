import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import {
  HiHome, HiBookOpen, HiClipboardDocumentList,
  HiDocumentText, HiCalendarDays, HiBell, HiUserCircle
} from 'react-icons/hi2';

const facultyLinks = [
  { path: '/faculty/dashboard', label: 'Dashboard', icon: HiHome, exact: true },
  { path: '/faculty/subjects', label: 'My Subjects', icon: HiBookOpen },
  { path: '/faculty/attendance', label: 'Mark Attendance', icon: HiClipboardDocumentList },
  { path: '/faculty/assignments', label: 'Assignments', icon: HiDocumentText },
  { path: '/faculty/timetable', label: 'My Timetable', icon: HiCalendarDays },
  { path: '/faculty/notices', label: 'Notices', icon: HiBell },
  { path: '/faculty/profile', label: 'Profile', icon: HiUserCircle },
];

const FacultyLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black">
      <Sidebar links={facultyLinks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 animate-fade-in"><Outlet /></main>
      </div>
    </div>
  );
};

export default FacultyLayout;
