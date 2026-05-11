import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { HiHome, HiTruck, HiQrCode, HiArrowPath, HiMapPin, HiUserCircle } from 'react-icons/hi2';

const employeeLinks = [
  { path: '/employee/dashboard', label: 'Dashboard', icon: HiHome, exact: true },
  { path: '/employee/assigned-shipments', label: 'Assigned Shipments', icon: HiTruck },
  { path: '/employee/scan-qr', label: 'Scan QR', icon: HiQrCode },
  { path: '/employee/update-status', label: 'Update Status', icon: HiArrowPath },
  { path: '/employee/live-location', label: 'Live Location', icon: HiMapPin },
  { path: '/employee/profile', label: 'Profile', icon: HiUserCircle },
];

const EmployeeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black">
      <Sidebar links={employeeLinks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 animate-fade-in"><Outlet /></main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
