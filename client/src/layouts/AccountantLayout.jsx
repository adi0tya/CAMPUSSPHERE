import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import {
  HiHome, HiCurrencyRupee, HiDocumentText, HiChartBar, HiUserCircle
} from 'react-icons/hi2';

const accountantLinks = [
  { path: '/accountant/dashboard', label: 'Dashboard', icon: HiHome, exact: true },
  { path: '/accountant/fees', label: 'Fee Management', icon: HiCurrencyRupee },
  { path: '/accountant/payments', label: 'Payment Records', icon: HiDocumentText },
  { path: '/accountant/reports', label: 'Fee Reports', icon: HiChartBar },
  { path: '/accountant/profile', label: 'Profile', icon: HiUserCircle },
];

const AccountantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-black">
      <Sidebar links={accountantLinks} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:ml-64">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6 animate-fade-in"><Outlet /></main>
      </div>
    </div>
  );
};

export default AccountantLayout;
