import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Briefcase, UserPlus, Plus, Globe, Search, ArrowRight, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RightPanel({ isOpen, onClose, children }) {
  const { notifications, projects, user } = useApp();
  const navigate = useNavigate();
  const [commSearch, setCommSearch] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCommSearch = (e) => {
    e.preventDefault();
    if (commSearch.trim()) {
      navigate(`/communities?search=${encodeURIComponent(commSearch)}`);
    } else {
      navigate('/communities');
    }
  };

  const BuilderScore = 85;

  return (
    <aside
      className={`fixed top-0 right-0 h-full w-[340px] z-50 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col glass-card border-r-0 border-y-0 rounded-none
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:static lg:block hidden'}
      `}
      style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}
    >
      <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-12">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h3 className="heading-gradient text-lg font-black tracking-[-0.07em]">Market Intelligence</h3>
          {isOpen && (
            <button onClick={onClose} className="lg:hidden text-zinc-500 hover:text-white transition-colors">
              <ArrowRight size={18} />
            </button>
          )}
        </div>

        {/* Builder Score Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
             <TrendingUp size={14} className="text-violet-500" />
             <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Rising Builder</h4>
          </div>
          <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden group border-violet-500/10">
            <div className="absolute inset-0 bg-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-36 h-36 flex items-center justify-center mb-4">
               <div className="absolute inset-0 bg-violet-500/10 blur-[30px] rounded-full" />
               <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.03)" strokeWidth="4" fill="none" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 263.89 }}
                    animate={{ strokeDashoffset: 263.89 - (263.89 * BuilderScore) / 100 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="50" cy="50" r="42" 
                    stroke="var(--color-accent-violet)" 
                    strokeWidth="4" 
                    fill="none" 
                    strokeDasharray="263.89" 
                    strokeLinecap="round"
                  />
               </svg>
               <div className="absolute flex flex-col items-center justify-center">
                 <span className="mono-data font-black text-3xl text-white tracking-tighter leading-none">{BuilderScore}</span>
                 <span className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Global Index</span>
               </div>
            </div>
            <p className="text-zinc-500 text-xs text-center leading-relaxed">Velocity increased by 12%<br/>vs last 7 days.</p>
          </div>
        </section>

        {/* Discovery Search */}
        <section className="space-y-4">
           <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Search Ecosystem</h4>
           <form onSubmit={handleCommSearch} className="relative">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                type="text" 
                placeholder="Find a collective..." 
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg py-3 pl-11 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]"
                value={commSearch}
                onChange={(e) => setCommSearch(e.target.value)}
              />
           </form>
        </section>

        {/* Notifications */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Activity Stream</h4>
            {unreadCount > 0 && <span className="neon-pill">{unreadCount} NEW</span>}
          </div>
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="group cursor-pointer flex gap-4 items-start"
                  onClick={() => navigate('/notifications')}
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-violet-400 group-hover:border-violet-500/30 transition-all">
                    {n.type === 'collaboration' ? <UserPlus size={14} /> : <Bell size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed group-hover:text-zinc-200 transition-colors">{n.text}</p>
                    <span className="mono-data text-[10px] text-zinc-600 mt-1 block uppercase tracking-wider">{n.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-700 py-4 border border-dashed border-white/5 rounded-lg text-center">
                Quiet in the stream.
              </div>
            )}
          </div>
        </section>

        {/* Action Center */}
        <section className="space-y-4 pt-4">
          <button
            className="glow-button w-full h-11 rounded-lg text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            onClick={() => navigate('/upload')}
          >
            <Plus size={14} strokeWidth={2.5} /> Deploy Project
          </button>
          <button
            className="w-full h-11 rounded-lg border border-white/5 bg-white/[0.02] text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.05] transition-all text-[11px] font-bold uppercase tracking-widest"
            onClick={() => navigate('/communities')}
          >
            Explore Collectives
          </button>
        </section>

      </div>
    </aside>
  );
}
