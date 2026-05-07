import { Link, useLocation } from 'react-router-dom';
import { Home, User, Package, Globe, BarChart2, Share2, MessageSquare, Settings, FileText, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auth } from '../config/firebase';

const BOTTOM_ITEMS = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/terms', icon: FileText, label: 'Terms' },
];

export default function Sidebar({ isSidebarOpen, onNavigate }) {
  const location = useLocation();
  const { user } = useApp();

  const handleNavigate = () => {
    if (onNavigate) onNavigate();
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path.split('/')[1] ? `/${path.split('/')[1]}` : path);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: user ? `/profile/${user.id}` : '/login', icon: User, label: 'Profile' },
    { to: '/explore', icon: Package, label: 'Projects' },
    { to: '/communities', icon: Globe, label: 'Community' },
    { to: '/contributions', icon: BarChart2, label: 'Contributions' },
    { to: '/connects', icon: Share2, label: 'Connects' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/resume', icon: Sparkles, label: 'AI Resume' },
  ];

  return (
    <aside className={`
      fixed top-0 left-0 h-full z-50
      bg-[#161618]/60 backdrop-blur-xl border-r border-white/5
      transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
      flex flex-col
      ${isSidebarOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0 lg:w-[80px] hover:w-[260px] group'}
    `}>
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar pb-6">
        <Link to="/" className="flex items-center h-[80px] px-6 shrink-0 text-white group-hover:px-6 lg:px-0 lg:justify-center group-hover:justify-start">
          <div className="w-[32px] h-[32px] rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center font-display font-bold text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)] shrink-0">
            AD
          </div>
          <span className={`ml-4 font-display font-semibold tracking-[-0.02em] text-lg whitespace-nowrap transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden group-hover:opacity-100 group-hover:block'}`}>
            ProjectSpace
          </span>
        </Link>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex items-center h-[44px] px-3 rounded-xl transition-all duration-200 group/item relative
                  ${active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
                onClick={handleNavigate}
                title={item.label}
              >
                <div className={`flex items-center justify-center ${isSidebarOpen ? 'w-[20px]' : 'w-full lg:w-[20px] group-hover:w-[20px]'} shrink-0`}>
                  <Icon size={20} className={active ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : ''} />
                </div>
                <span className={`ml-4 whitespace-nowrap font-medium text-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden group-hover:opacity-100 group-hover:block'}`}>
                  {item.label}
                </span>
                {active && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-violet-500 rounded-r-full transition-all duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'}`} />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 mt-auto space-y-1">
          {BOTTOM_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`
                  flex items-center h-[44px] px-3 rounded-xl transition-all duration-200
                  ${active ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'}
                `}
                onClick={handleNavigate}
                title={item.label}
              >
                <div className={`flex items-center justify-center ${isSidebarOpen ? 'w-[20px]' : 'w-full lg:w-[20px] group-hover:w-[20px]'} shrink-0`}>
                  <Icon size={20} />
                </div>
                <span className={`ml-4 whitespace-nowrap font-medium text-sm transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 lg:hidden group-hover:opacity-100 group-hover:block'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className={`px-4 pt-6 mt-4 border-t border-white/5 transition-all duration-300 ${isSidebarOpen ? 'block' : 'hidden lg:block'}`}>
          {user ? (
            <div className={`flex flex-col ${isSidebarOpen ? 'items-start' : 'items-center group-hover:items-start'}`}>
              <div className="flex items-center w-full">
                <img src={user.avatar} alt={user.name} className="w-[36px] h-[36px] rounded-full border border-white/10 shrink-0" />
                <div className={`ml-3 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0 lg:hidden group-hover:opacity-100 group-hover:w-auto group-hover:ml-3'}`}>
                  <p className="text-white text-sm font-medium truncate">{user.name}</p>
                  <p className="text-slate-500 text-[11px] truncate">{user.tagline}</p>
                </div>
              </div>
              <button 
                className={`mt-4 w-full h-[36px] rounded-lg border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white text-xs font-medium transition-all duration-300 ${isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden lg:hidden group-hover:opacity-100 group-hover:block'}`}
                onClick={() => auth.signOut()}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className={`flex flex-col gap-2 ${isSidebarOpen ? 'opacity-100 block' : 'opacity-0 hidden lg:hidden group-hover:opacity-100 group-hover:flex'}`}>
              <Link to="/login" className="h-[36px] flex items-center justify-center rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors" onClick={handleNavigate}>
                Log In
              </Link>
              <Link to="/signup" className="h-[36px] flex items-center justify-center rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white text-sm font-medium transition-colors" onClick={handleNavigate}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
