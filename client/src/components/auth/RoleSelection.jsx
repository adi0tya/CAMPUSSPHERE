import { useNavigate } from 'react-router-dom';
import { HiShieldCheck, HiAcademicCap, HiUserGroup, HiCalculator } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { getDashboardPath } from '../../context/AuthContext';

const roles = [
  {
    key: 'admin',
    label: 'Admin',
    desc: 'Manage students, faculty, courses, and view all reports',
    icon: HiShieldCheck,
    gradient: 'gradient-cyan',
    accent: 'text-cyan-400',
    shadow: 'shadow-cyan-500/20',
    path: '/login/admin'
  },
  {
    key: 'faculty',
    label: 'Faculty',
    desc: 'Mark attendance, manage assignments, and view timetable',
    icon: HiAcademicCap,
    gradient: 'gradient-primary',
    accent: 'text-indigo-400',
    shadow: 'shadow-indigo-500/20',
    path: '/login/faculty'
  },
  {
    key: 'student',
    label: 'Student',
    desc: 'View attendance, assignments, fees, and timetable',
    icon: HiUserGroup,
    gradient: 'gradient-success',
    accent: 'text-emerald-400',
    shadow: 'shadow-emerald-500/20',
    path: '/login/student'
  },
  {
    key: 'accountant',
    label: 'Accountant',
    desc: 'Manage fee records, payments, and financial reports',
    icon: HiCalculator,
    gradient: 'gradient-warning',
    accent: 'text-amber-400',
    shadow: 'shadow-amber-500/20',
    path: '/login/accountant'
  }
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) navigate(getDashboardPath(user.role), { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-cyan mb-6 shadow-lg shadow-cyan-500/20">
            <HiAcademicCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Campus<span className="text-gradient">Sphere</span> ERP
          </h1>
          <p className="text-gray-500 text-lg">Campus & Organization Management System</p>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-300">Continue as</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => navigate(role.path)}
              className="group glass p-6 text-left card-hover cursor-pointer"
            >
              <div className={`w-14 h-14 rounded-xl ${role.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg ${role.shadow}`}>
                <role.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{role.label}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{role.desc}</p>
              <div className={`mt-5 flex items-center ${role.accent} text-sm font-medium`}>
                Continue as {role.label}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
