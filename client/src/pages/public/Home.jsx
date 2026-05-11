import { useNavigate } from 'react-router-dom';
import { HiAcademicCap, HiShieldCheck, HiUsers, HiChartBar, HiCalendar, HiCurrencyRupee } from 'react-icons/hi2';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-cyan flex items-center justify-center">
            <HiAcademicCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Campus<span className="text-gradient">Sphere</span></span>
        </div>
        <button onClick={() => navigate('/select-role')} className="px-6 py-2.5 gradient-cyan rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity">Login</button>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/8 border border-cyan-500/15 mb-8">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 text-sm font-medium">Campus Management System</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white text-center max-w-4xl leading-tight mb-6">
          Manage Your <span className="text-gradient">Campus</span> Efficiently
        </h1>

        <p className="text-gray-500 text-lg md:text-xl text-center max-w-2xl mb-12">
          Complete ERP solution for educational institutions. Manage students, faculty, courses, attendance, fees, and more.
        </p>

        <button onClick={() => navigate('/select-role')} className="px-8 py-4 gradient-cyan rounded-2xl text-white text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-cyan-500/20">
          Get Started
        </button>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          {[
            { icon: HiUsers, label: 'Student Management', desc: 'Complete student records' },
            { icon: HiAcademicCap, label: 'Faculty Management', desc: 'Manage teaching staff' },
            { icon: HiChartBar, label: 'Attendance Tracking', desc: 'Real-time attendance' },
            { icon: HiCalendar, label: 'Timetable', desc: 'Class scheduling' },
            { icon: HiCurrencyRupee, label: 'Fee Management', desc: 'Payment tracking' },
            { icon: HiShieldCheck, label: 'Secure & Reliable', desc: 'Data protection' },
          ].map((f, i) => (
            <div key={i} className="glass p-6 text-center card-hover">
              <f.icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-1">{f.label}</h3>
              <p className="text-gray-600 text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
