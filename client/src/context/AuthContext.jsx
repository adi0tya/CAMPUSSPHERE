import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
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
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally { setLoading(false); }
  };

  const adminRegister = async (formData) => {
    const { data } = await API.post('/api/auth/admin/register', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success('Admin account created!');
    return data;
  };

  const employeeRegister = async (formData) => {
    const { data } = await API.post('/api/auth/employee/register', formData);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success('Employee account created!');
    return data;
  };

  const adminLogin = async (email, password) => {
    const { data } = await API.post('/api/auth/admin/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success('Welcome back, Admin!');
    return data;
  };

  const employeeLogin = async (email, password) => {
    const { data } = await API.post('/api/auth/employee/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}!`);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, adminRegister, employeeRegister, adminLogin, employeeLogin, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
