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
      <header className="lg:hidden fixed top-0 w-full h-[60px] bg-[#0F0F11]/80 backdrop-blur-[12px] border-b border-white/[0.08] flex items-center justify-between px-4 z-50">
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
        className={`hidden lg:flex fixed top-6 right-6 p-3 rounded-full bg-[#0F0F11] border border-white/[0.08] text-slate-300 hover:text-white hover:border-[#a855f7]/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all z-40 ${isRightOpen ? 'hidden' : ''}`}
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
      
      {/* Main Content Area: 12-column grid */}
      <main className="flex-1 lg:ml-[80px] hover:lg:ml-[260px] transition-all duration-300 min-h-screen">
        <div className="pt-[80px] lg:pt-0 p-8">
          <div className="grid grid-cols-12 gap-8 max-w-[1600px] mx-auto">
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
