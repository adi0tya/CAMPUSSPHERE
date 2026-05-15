import { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { HiShieldCheck, HiAcademicCap, HiUserGroup, HiCalculator, HiEnvelope, HiLockClosed, HiEye, HiEyeSlash, HiUser, HiPhone } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { getDashboardPath } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const roleConfig = {
  admin: { label: 'Admin', icon: HiShieldCheck, gradient: 'gradient-cyan', accent: 'bg-cyan-500', focusColor: 'focus:border-cyan-500' },
  faculty: { label: 'Faculty', icon: HiAcademicCap, gradient: 'gradient-primary', accent: 'bg-indigo-500', focusColor: 'focus:border-indigo-500' },
  student: { label: 'Student', icon: HiUserGroup, gradient: 'gradient-success', accent: 'bg-emerald-500', focusColor: 'focus:border-emerald-500' },
  accountant: { label: 'Accountant', icon: HiCalculator, gradient: 'gradient-warning', accent: 'bg-amber-500', focusColor: 'focus:border-amber-500' }
};

const LoginPage = () => {
  const { role } = useParams();
  const config = roleConfig[role];
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [otpStep, setOtpStep] = useState(false);
  const [resetStep, setResetStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [resetForm, setResetForm] = useState({ email: '', otp: '', newPassword: '' });

  const { login, register, requestOTP, forgotPassword, resetPassword } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return toast.error('Fill all fields');
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password, role);
      navigate(getDashboardPath(role), { replace: true });
    } catch (err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!otpStep) {
      if (!regForm.name || !regForm.email || !regForm.phone || !regForm.password || !regForm.confirmPassword) return toast.error('Fill all fields');
      if (regForm.password !== regForm.confirmPassword) return toast.error('Passwords do not match');
      if (regForm.password.length < 6) return toast.error('Password must be at least 6 characters');
      
      setLoading(true);
      try {
        await requestOTP(regForm.email);
        setOtpStep(true);
      } catch (err) { toast.error(err.response?.data?.message || 'Failed to send OTP'); }
      finally { setLoading(false); }
    } else {
      if (!otp) return toast.error('Enter OTP');
      setLoading(true);
      try {
        await register({ ...regForm, role, otp });
        navigate(getDashboardPath(role), { replace: true });
      } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
      finally { setLoading(false); }
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!resetStep) {
      if (!resetForm.email) return toast.error('Enter your email');
      setLoading(true);
      try {
        await forgotPassword(resetForm.email);
        setResetStep(true);
      } catch (err) { toast.error(err.response?.data?.message || 'Failed to send OTP'); }
      finally { setLoading(false); }
    } else {
      if (!resetForm.otp || !resetForm.newPassword) return toast.error('Fill all fields');
      setLoading(true);
      try {
        await resetPassword(resetForm.email, resetForm.otp, resetForm.newPassword);
        toast.success('Password reset! Please login.');
        setTab('login');
        setResetStep(false);
      } catch (err) { toast.error(err.response?.data?.message || 'Failed to reset password'); }
      finally { setLoading(false); }
    }
  };

  const ic = `w-full pl-11 pr-4 py-3 bg-black border border-[#2a2a2a] rounded-xl text-white placeholder-gray-600 text-sm ${config.focusColor} outline-none transition-all`;
  const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600";

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl ${config.gradient} mb-4 shadow-lg`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">{config.label} Portal</h1>
          <p className="text-gray-500 mt-2">CampusSphere ERP</p>
        </div>

        <div className="flex bg-[#111111] rounded-xl p-1 mb-6 border border-[#2a2a2a]">
          <button onClick={() => { setTab('login'); setOtpStep(false); setResetStep(false); }} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'login' ? `${config.accent} text-white` : 'text-gray-500 hover:text-white'}`}>Login</button>
          <button onClick={() => { setTab('register'); setOtpStep(false); setResetStep(false); }} className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'register' ? `${config.accent} text-white` : 'text-gray-500 hover:text-white'}`}>Register</button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="glass p-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div className="relative">
                <HiEnvelope className={iconClass} />
                <input type="email" value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} placeholder={`${role}@example.com`} className={ic} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <HiLockClosed className={iconClass} />
                <input type={showPass ? 'text' : 'password'} value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} placeholder="Enter password" className={`${ic} !pr-12`} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
                  {showPass ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setTab('forgot')} className={`text-sm text-gray-500 hover:text-white transition-colors`}>Forgot Password?</button>
            </div>
            <button type="submit" disabled={loading} className={`w-full py-3 ${config.gradient} rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2`}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>
          </form>
        ) : tab === 'forgot' ? (
          <form onSubmit={handleForgotSubmit} className="glass p-8 space-y-5">
            <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
            {!resetStep ? (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Enter Registered Email</label>
                <div className="relative"><HiEnvelope className={iconClass} /><input type="email" value={resetForm.email} onChange={e => setResetForm({ ...resetForm, email: e.target.value })} placeholder="email@example.com" className={ic} /></div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">6-Digit OTP</label>
                  <input type="text" value={resetForm.otp} onChange={e => setResetForm({ ...resetForm, otp: e.target.value })} placeholder="Enter OTP from Email" className={`${ic} text-center tracking-widest text-lg`} maxLength={6} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
                  <div className="relative"><HiLockClosed className={iconClass} /><input type="password" value={resetForm.newPassword} onChange={e => setResetForm({ ...resetForm, newPassword: e.target.value })} placeholder="New Password" className={ic} /></div>
                </div>
              </>
            )}
            <button type="submit" disabled={loading} className={`w-full py-3 ${config.gradient} rounded-xl text-white font-semibold hover:opacity-90 transition-opacity flex justify-center`}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (!resetStep ? 'Send OTP' : 'Reset Password')}
            </button>
            <button type="button" onClick={() => setTab('login')} className="w-full text-sm text-gray-500 hover:text-white mt-4">Back to Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="glass p-8 space-y-4">
            {!otpStep ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Full Name</label>
                  <div className="relative"><HiUser className={iconClass} /><input value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} placeholder="Your full name" className={ic} /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                  <div className="relative"><HiEnvelope className={iconClass} /><input type="email" value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} placeholder={`${role}@example.com`} className={ic} /></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">Phone</label>
                  <div className="relative"><HiPhone className={iconClass} /><input value={regForm.phone} onChange={e => setRegForm({ ...regForm, phone: e.target.value })} placeholder="+91-XXXXXXXXXX" className={ic} /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
                    <div className="relative"><HiLockClosed className={iconClass} /><input type="password" value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} placeholder="Min 6 chars" className={ic} /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Confirm</label>
                    <div className="relative"><HiLockClosed className={iconClass} /><input type="password" value={regForm.confirmPassword} onChange={e => setRegForm({ ...regForm, confirmPassword: e.target.value })} placeholder="Re-enter" className={ic} /></div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <h3 className="text-white font-medium mb-4">Verify Your Email</h3>
                <p className="text-sm text-gray-400 mb-6">We've sent a 6-digit code to {regForm.email}</p>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value)} placeholder="• • • • • •" className={`${ic} text-center tracking-[1em] text-xl font-bold`} maxLength={6} />
                <button type="button" onClick={() => setOtpStep(false)} className="text-sm text-gray-500 mt-4 hover:text-white transition-colors">Wrong email? Go back.</button>
              </div>
            )}
            
            <button type="submit" disabled={loading} className={`w-full py-3 ${config.gradient} rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2`}>
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (!otpStep ? `Create ${config.label} Account` : 'Verify & Complete Registration')}
            </button>
          </form>
        )}

        <div className="text-center mt-6">
          <Link to="/select-role" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">← Back to role selection</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
