import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HiUserGroup, HiEnvelope, HiLockClosed, HiEye, HiEyeSlash, HiUser, HiPhone, HiTruck } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EmployeeLogin = () => {
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { employeeLogin, employeeRegister } = useAuth();

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '', employeeType: 'warehouse', vehicleNumber: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return toast.error('Fill all fields');
    setLoading(true);
    try { await employeeLogin(loginForm.email, loginForm.password); navigate('/employee/dashboard', { replace: true }); }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regForm.name || !regForm.email || !regForm.phone || !regForm.password || !regForm.confirmPassword) return toast.error('Fill all fields');
    if (regForm.password !== regForm.confirmPassword) return toast.error('Passwords do not match');
    if (regForm.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (regForm.employeeType === 'driver' && !regForm.vehicleNumber) return toast.error('Vehicle number required for drivers');
    setLoading(true);
    try { await employeeRegister(regForm); navigate('/employee/dashboard', { replace: true }); }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const inputClass = "w-full pl-11 pr-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm focus:border-emerald-500";
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl gradient-success mb-4 shadow-lg shadow-emerald-500/20">
            <HiUserGroup className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Employee Portal</h1>
          <p className="text-gray-500 mt-2">Sign in or create your employee account</p>
        </div>

        <div className="flex bg-[#111111] rounded-xl p-1 mb-6 border border-[#2a2a2a]">
          <button onClick={() => setTab('login')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'login' ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:text-white'}`}>Login</button>
          <button onClick={() => setTab('register')} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'register' ? 'bg-emerald-500 text-white' : 'text-gray-500 hover:text-white'}`}>Register</button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="glass p-8 space-y-5">
            <div><label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="relative"><HiEnvelope className={iconClass} /><input type="email" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} placeholder="employee@example.com" className={inputClass} /></div></div>
            <div><label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative"><HiLockClosed className={iconClass} /><input type={showPass ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="Enter password" className={`${inputClass} !pr-12`} />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">{showPass ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}</button></div></div>
            <button type="submit" disabled={loading} className="w-full py-3 gradient-success rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="glass p-8 space-y-4">
            <div><label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
              <div className="relative"><HiUser className={iconClass} /><input value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} placeholder="Your full name" className={inputClass} /></div></div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
              <div className="relative"><HiEnvelope className={iconClass} /><input type="email" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} placeholder="employee@example.com" className={inputClass} /></div></div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1.5">Phone</label>
              <div className="relative"><HiPhone className={iconClass} /><input value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} placeholder="+91-XXXXXXXXXX" className={inputClass} /></div></div>
            <div><label className="block text-sm font-medium text-gray-400 mb-1.5">Employee Type</label>
              <select value={regForm.employeeType} onChange={e => setRegForm({...regForm, employeeType: e.target.value})} className="w-full px-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white text-sm">
                <option value="warehouse">Warehouse Employee</option>
                <option value="driver">Delivery Driver</option>
              </select></div>
            {regForm.employeeType === 'driver' && (
              <div><label className="block text-sm font-medium text-gray-400 mb-1.5">Vehicle Number</label>
                <div className="relative"><HiTruck className={iconClass} /><input value={regForm.vehicleNumber} onChange={e => setRegForm({...regForm, vehicleNumber: e.target.value})} placeholder="MH-01-AB-1234" className={inputClass} /></div></div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                <div className="relative"><HiLockClosed className={iconClass} /><input type="password" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} placeholder="Min 6 chars" className={inputClass} /></div></div>
              <div><label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm</label>
                <div className="relative"><HiLockClosed className={iconClass} /><input type="password" value={regForm.confirmPassword} onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})} placeholder="Re-enter" className={inputClass} /></div></div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 gradient-success rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Employee Account'}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/select-role" className="text-gray-500 hover:text-emerald-400 text-sm transition-colors">← Back to role selection</Link>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
