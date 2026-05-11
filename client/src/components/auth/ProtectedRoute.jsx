import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/select-role" replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboards = {
      admin: '/admin/dashboard',
      faculty: '/faculty/dashboard',
      student: '/student/dashboard',
      accountant: '/accountant/dashboard'
    };
    return <Navigate to={dashboards[user.role] || '/select-role'} replace />;
  }

  return children;
};

export default ProtectedRoute;
