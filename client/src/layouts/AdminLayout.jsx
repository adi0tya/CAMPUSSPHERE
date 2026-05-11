import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { HiHome, HiTruck, HiPlusCircle, HiBuildingOffice2, HiUsers, HiIdentification, HiChartBar, HiUserCircle } from 'react-icons/hi2';

const adminLinks = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: HiHome, exact: true },
  { path: '/admin/shipments', label: 'Shipments', icon: HiTruck },
  { path: '/admin/create-shipment', label: 'Create Shipment', icon: HiPlusCircle },
  { path: '/admin/warehouses', label: 'Warehouses', icon: HiBuildingOffice2 },
  { path: '/admin/employees', label: 'Employees', icon: HiUsers },
  { path: '/admin/drivers', label: 'Drivers', icon: HiIdentification },
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
