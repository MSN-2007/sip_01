import { useState } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

export default function MainLayout({ children, rightPanelContent }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-slate-400 font-body flex w-full">
      
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full h-[60px] border-b border-t-transparent flex items-center justify-between px-4 z-50" style={{ background: 'rgba(13,13,15,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
         <button className="p-2 text-slate-300 hover:text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
         </button>
         <span className="font-display font-black text-white text-lg tracking-[-0.05em]">ProjectSpace</span>
         <button className="p-2 text-slate-300 hover:text-white" onClick={() => setIsRightOpen(!isRightOpen)}>
            <Bell size={20} strokeWidth={1.5} />
         </button>
      </header>

      {/* Desktop Right Panel Toggle */}
      <button 
        className={`hidden lg:flex fixed top-6 right-6 p-3 rounded-full text-slate-300 hover:text-white transition-all duration-300 z-40 ${isRightOpen ? '!hidden' : ''}`}
        style={{ background: '#0D0D0F', border: '1px solid rgba(255,255,255,0.08)' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.3)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
        onClick={() => setIsRightOpen(true)}
      >
        <Bell size={20} strokeWidth={1.5} />
      </button>

      {/* Overlay Backdrop */}
      {(isSidebarOpen || isRightOpen) && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => {
            setIsSidebarOpen(false);
            setIsRightOpen(false);
          }} 
        />
      )}

      {/* Sidebar - collapsible dock */}
      <Sidebar isSidebarOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
      
      {/* Main Content — Fix #8: Breathable Layout, padding increased 50% */}
      <main className="flex-1 lg:ml-[80px] hover:lg:ml-[260px] transition-all duration-300 min-h-screen">
        <div className="pt-[80px] lg:pt-0 p-12">
          <div className="grid grid-cols-12 gap-12 max-w-[1600px] mx-auto">
            <div className="col-span-12">
              {children}
            </div>
          </div>
        </div>
      </main>

      <RightPanel isOpen={isRightOpen} onClose={() => setIsRightOpen(false)}>
        {rightPanelContent}
      </RightPanel>
    </div>
  );
}
