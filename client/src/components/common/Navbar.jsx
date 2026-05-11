import { useAuth } from '../../context/AuthContext';
import { HiBell, HiArrowRightOnRectangle, HiBars3 } from 'react-icons/hi2';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#111111] border-b border-[#2a2a2a] flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="lg:hidden text-gray-500 hover:text-white transition-colors">
          <HiBars3 className="w-6 h-6" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-xs font-medium text-gray-600">Welcome back,</h2>
          <p className="text-white font-semibold text-sm">{user?.name}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative w-10 h-10 rounded-xl bg-[#181818] border border-[#2a2a2a] hover:border-[#333] flex items-center justify-center transition-colors">
          <HiBell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full" />
        </button>
        <div className="w-10 h-10 rounded-xl gradient-cyan flex items-center justify-center text-white font-bold text-sm">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <button onClick={logout} className="w-10 h-10 rounded-xl bg-[#181818] border border-[#2a2a2a] hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 flex items-center justify-center text-gray-500 transition-all" title="Logout">
          <HiArrowRightOnRectangle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
