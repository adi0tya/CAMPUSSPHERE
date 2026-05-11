import { NavLink } from 'react-router-dom';
import { HiXMark, HiAcademicCap } from 'react-icons/hi2';

const Sidebar = ({ links, isOpen, onClose }) => {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/70 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-[#0a0a0a] border-r border-[#2a2a2a] z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg gradient-cyan flex items-center justify-center">
              <HiAcademicCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Campus<span className="text-cyan-400">Sphere</span></span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
            <HiXMark className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {links.map((link, index) => (
            <NavLink
              key={index}
              to={link.path}
              end={link.exact}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'active bg-cyan-500/8 text-cyan-400' : 'text-gray-500 hover:text-white hover:bg-[#111111]'}`
              }
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
