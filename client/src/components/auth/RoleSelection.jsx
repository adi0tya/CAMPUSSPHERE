import { useNavigate } from 'react-router-dom';
import { HiShieldCheck, HiUserGroup } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate(user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard', { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-cyan mb-6 shadow-lg shadow-cyan-500/20">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Track<span className="text-gradient">Sphere</span></h1>
          <p className="text-gray-500 text-lg">Real-Time Logistics & Shipment Tracking ERP</p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-300">Continue as</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button onClick={() => navigate('/admin/login')} className="group glass p-8 text-left card-hover cursor-pointer">
            <div className="w-16 h-16 rounded-xl gradient-cyan flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-cyan-500/20">
              <HiShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Admin</h3>
            <p className="text-gray-500 text-sm leading-relaxed">Manage shipments, warehouses, employees, and view analytics</p>
            <div className="mt-6 flex items-center text-cyan-400 text-sm font-medium">
              Continue as Admin
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>

          <button onClick={() => navigate('/employee/login')} className="group glass p-8 text-left card-hover cursor-pointer">
            <div className="w-16 h-16 rounded-xl gradient-success flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
              <HiUserGroup className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Employee</h3>
            <p className="text-gray-500 text-sm leading-relaxed">View assigned shipments, scan QR codes, and update delivery status</p>
            <div className="mt-6 flex items-center text-emerald-400 text-sm font-medium">
              Continue as Employee
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </button>
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 text-sm">
            Want to track a shipment?{' '}
            <button onClick={() => navigate('/')} className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">Track here</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
