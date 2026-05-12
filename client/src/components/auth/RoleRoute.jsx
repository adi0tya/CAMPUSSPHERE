import { Navigate } from 'react-router-dom';
import { useAuth, getDashboardPath } from '../../context/AuthContext';
import Loader from '../common/Loader';

const RoleRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to={`/login/${role}`} replace />;
  }

  if (user.role !== role) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default RoleRoute;
