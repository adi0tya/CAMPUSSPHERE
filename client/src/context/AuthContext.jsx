import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const ROLE_DASHBOARDS = {
  admin: '/admin/dashboard',
  faculty: '/faculty/dashboard',
  student: '/student/dashboard',
  accountant: '/accountant/dashboard'
};

export const getDashboardPath = (role) => ROLE_DASHBOARDS[role] || '/select-role';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved && saved !== 'undefined' ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) fetchUser();
    else setLoading(false);
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await API.get('/api/auth/me');
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); // Sync any updates
    } catch (err) {
      // Only clear auth on actual 401 unauthorized errors, not network timeouts
      if (err.response && err.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    } finally { setLoading(false); }
  };

  const login = async (email, password, role) => {
    const { data } = await API.post('/api/auth/login', { email, password, role });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}!`);
    return data;
  };



  const register = async (formData) => {
    const { data } = await API.post('/api/auth/register', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success('Account created successfully!');
    return data;
  };



  const resetPassword = async (email, newPassword) => {
    const { data } = await API.post('/api/auth/reset-password', { email, newPassword });
    toast.success(data.message);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    API.post('/api/auth/logout').catch(console.error);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, resetPassword, logout, fetchUser, getDashboardPath }}>
      {children}
    </AuthContext.Provider>
  );
};
