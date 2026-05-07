import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Briefcase, UserPlus, Plus, Globe, Search, ArrowRight, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function RightPanel({ isOpen, onClose, children }) {
  const { notifications, projects, user } = useApp();
  const navigate = useNavigate();
  const [commSearch, setCommSearch] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;
  const activeProjects = projects.filter(p => p.stage === 'Prototype' || p.stage === 'Production').slice(0, 2);

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
      className={`fixed top-0 right-0 h-full w-[320px] z-50 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 lg:static lg:block hidden'}`}
      style={{
        background: 'rgba(13,13,15,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        
        {/* Rising Builder Section - Circular Glowing Gauge */}
        <section>
          <div className="flex items-center gap-2 mb-4">
             <TrendingUp size={16} className="text-[#a855f7]" strokeWidth={1.5} />
             <h3 className="text-white font-black tracking-[-0.05em]">Rising Builder</h3>
          </div>
          <div className="obsidian-card rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group cursor-default">
            <div className="absolute inset-0 bg-gradient-to-b from-[#6366f1]/5 to-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative w-32 h-32 flex items-center justify-center mb-3">
               <div className="absolute inset-0 bg-[#a855f7]/20 blur-[20px] rounded-full" />
               <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="none" />
                  <circle 
                    cx="50" cy="50" r="40" 
                    stroke="url(#gaugeGradient)" 
                    strokeWidth="6" 
                    fill="none" 
                    strokeDasharray="251.2" 
                    strokeDashoffset={251.2 - (251.2 * BuilderScore) / 100} 
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
               </svg>
               <div className="absolute flex flex-col items-center justify-center">
                 <span className="stat-value font-black text-2xl text-white tracking-tighter">{BuilderScore}</span>
                 <span className="data-label text-[9px] text-zinc-500 uppercase tracking-widest font-bold">Score</span>
               </div>
            </div>
            <p className="text-zinc-400 text-sm text-center relative z-10">Top 15% of builders this week.</p>
          </div>
        </section>

        {/* Discovery Section */}
        <section>
           <div className="flex items-center gap-2 mb-3">
             <Globe size={16} strokeWidth={1.5} className="text-slate-400" />
             <h3 className="text-white font-black tracking-[-0.05em]">Discovery</h3>
           </div>
           <form onSubmit={handleCommSearch} className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" strokeWidth={1.5} />
              <input 
                type="text" 
                placeholder="Find a community..." 
                className="w-full rounded-xl py-2.5 pl-9 pr-10 text-sm text-slate-300 focus:outline-none transition-colors placeholder:text-zinc-600"
                style={{ background: '#0D0D0F', border: '1px solid rgba(255,255,255,0.08)', borderTopColor: 'rgba(255,255,255,0.14)' }}
                onFocus={e => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(99,102,241,0.25)'}
                onBlur={e => e.currentTarget.style.boxShadow = 'none'}
                value={commSearch}
                onChange={(e) => setCommSearch(e.target.value)}
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-white transition-colors">
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
           </form>
        </section>

        {/* Notifications Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell size={16} strokeWidth={1.5} className="text-slate-400" />
              <h3 className="text-white font-black tracking-[-0.05em]">Notifications</h3>
            </div>
            {unreadCount > 0 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(99,102,241,0.15)', color: '#a855f7' }}>{unreadCount}</span>}
          </div>
          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  className="obsidian-card p-3 rounded-xl cursor-pointer hover:border-white/[0.12] transition-colors flex gap-3"
                  onClick={() => navigate('/notifications')}
                >
                  <div className="mt-0.5 text-zinc-500">
                    {n.type === 'collaboration' ? <UserPlus size={14} strokeWidth={1.5} /> : <Globe size={14} strokeWidth={1.5} />}
                  </div>
                  <div>
                    <p className="text-sm text-slate-300 line-clamp-2 leading-snug">{n.text}</p>
                    <span className="data-label text-[10px] text-zinc-600 mt-1 block">{n.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-zinc-600 py-2">No recent notifications</div>
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-white font-black tracking-[-0.05em] mb-3">Quick Actions</h3>
          <div className="space-y-2">
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-medium text-sm hover:opacity-90 transition-opacity"
              style={{ background: 'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
              onClick={() => navigate('/upload')}
            >
              <Plus size={16} strokeWidth={1.5} /> Create Project
            </button>
            <button
              className="ghost-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm"
              onClick={() => navigate('/communities')}
            >
              <Globe size={16} strokeWidth={1.5} /> Join Community
            </button>
          </div>
        </section>

      </div>
    </aside>
  );
}
