import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const RoleRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to={role === 'admin' ? '/admin/login' : '/employee/login'} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} replace />;
  }

  return children;
};

export default RoleRoute;
