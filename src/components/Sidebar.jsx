import { Link, useLocation } from 'react-router-dom';
import { Home, User, Package, Globe, BarChart2, Share2, MessageSquare, Settings, FileText, Sparkles, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auth } from '../config/firebase';
import { motion } from 'framer-motion';

const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/explore', icon: Package, label: 'Projects' },
  { to: '/communities', icon: Globe, label: 'Community' },
  { to: '/contributions', icon: BarChart2, label: 'Contributions' },
  { to: '/connects', icon: Share2, label: 'Connects' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/resume', icon: Sparkles, label: 'AI Resume' },
];

const SNAPPY_SPRING = { type: 'spring', stiffness: 400, damping: 30 };

export default function Sidebar({ isSidebarOpen, onNavigate }) {
  const location = useLocation();
  const { user } = useApp();

  const handleNavigate = () => {
    if (onNavigate) onNavigate();
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col glass-card border-l-0 border-y-0 rounded-none
        ${isSidebarOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0 lg:w-20 hover:w-[260px] group'}
      `}
      style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Brand Section */}
      <div className="h-24 flex items-center px-6 shrink-0 lg:justify-center group-hover:justify-start transition-all duration-500">
        <div className="w-9 h-9 rounded-lg bg-violet-500 flex items-center justify-center text-white font-black text-xs shadow-[0_0_20px_rgba(139,92,246,0.3)]">
          PS
        </div>
        <span className={`ml-4 font-black tracking-[-0.07em] text-xl heading-gradient whitespace-nowrap transition-all duration-500
          ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden group-hover:opacity-100 group-hover:block'}
        `}>
          ProjectSpace
        </span>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center h-12 px-3 rounded-lg transition-all duration-300 relative group/link
                ${active ? 'bg-violet-500/10 text-white' : 'text-zinc-500 hover:text-zinc-200'}
              `}
              onClick={handleNavigate}
            >
              <div className="w-8 flex items-center justify-center shrink-0">
                <Icon size={18} className={`${active ? 'text-violet-400' : 'text-inherit'} transition-colors`} />
              </div>
              <span className={`ml-3 text-[13px] font-medium tracking-tight whitespace-nowrap transition-all duration-500
                ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden group-hover:opacity-100 group-hover:block'}
              `}>
                {item.label}
              </span>

              {active && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-[2px] h-6 bg-violet-500 rounded-r-full"
                  transition={SNAPPY_SPRING}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profile Section */}
      <div className="p-4 mt-auto border-t border-white/5 bg-white/[0.02]">
        {user ? (
          <div className="flex flex-col gap-4">
            <Link 
              to={`/profile/${user.id}`} 
              className="flex items-center group/profile"
              onClick={handleNavigate}
            >
              <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-white/10 group-hover/profile:border-violet-500/50 transition-colors shrink-0" />
              <div className={`ml-3 overflow-hidden transition-all duration-500
                ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-3'}
              `}>
                <p className="text-white text-xs font-bold truncate tracking-tight">{user.name}</p>
                <p className="text-zinc-500 text-[10px] truncate uppercase tracking-widest mt-0.5">Contributor</p>
              </div>
            </Link>
            
            <button 
              onClick={() => auth.signOut()}
              className={`flex items-center gap-3 text-zinc-500 hover:text-white transition-all duration-500
                ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden group-hover:opacity-100 group-hover:flex'}
              `}
            >
              <LogOut size={16} />
              <span className="text-[11px] font-bold uppercase tracking-widest">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className={`flex flex-col gap-2 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden group-hover:opacity-100 group-hover:flex'}`}>
            <Link to="/login" className="glow-button h-10 flex items-center justify-center rounded-lg text-xs font-bold uppercase tracking-widest" onClick={handleNavigate}>
              Log In
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
