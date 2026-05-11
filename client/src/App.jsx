import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Loader from './components/common/Loader';

// Auth
import RoleSelection from './components/auth/RoleSelection';
import AdminLogin from './components/auth/AdminLogin';
import EmployeeLogin from './components/auth/EmployeeLogin';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import EmployeeLayout from './layouts/EmployeeLayout';

// Public Pages
import Home from './pages/public/Home';
import CustomerTracking from './pages/public/CustomerTracking';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ShipmentList from './pages/admin/ShipmentList';
import CreateShipment from './pages/admin/CreateShipment';
import WarehouseManagement from './pages/admin/WarehouseManagement';
import EmployeeManagement from './pages/admin/EmployeeManagement';
import Reports from './pages/admin/Reports';
import AdminProfile from './pages/admin/AdminProfile';

// Employee Pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import AssignedShipments from './pages/employee/AssignedShipments';
import ScanQR from './pages/employee/ScanQR';
import UpdateStatus from './pages/employee/UpdateStatus';
import LiveLocation from './pages/employee/LiveLocation';
import EmployeeProfile from './pages/employee/EmployeeProfile';

function App() {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/select-role" element={<RoleSelection />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/employee/login" element={<EmployeeLogin />} />
      <Route path="/track/:trackingId" element={<CustomerTracking />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><RoleRoute role="admin"><AdminLayout /></RoleRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="shipments" element={<ShipmentList />} />
        <Route path="create-shipment" element={<CreateShipment />} />
        <Route path="warehouses" element={<WarehouseManagement />} />
        <Route path="employees" element={<EmployeeManagement />} />
        <Route path="drivers" element={<EmployeeManagement />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee" element={<ProtectedRoute><RoleRoute role="employee"><EmployeeLayout /></RoleRoute></ProtectedRoute>}>
        <Route index element={<Navigate to="/employee/dashboard" replace />} />
        <Route path="dashboard" element={<EmployeeDashboard />} />
        <Route path="assigned-shipments" element={<AssignedShipments />} />
        <Route path="scan-qr" element={<ScanQR />} />
        <Route path="update-status" element={<UpdateStatus />} />
        <Route path="live-location" element={<LiveLocation />} />
        <Route path="profile" element={<EmployeeProfile />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
