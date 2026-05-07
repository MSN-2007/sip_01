import { useState } from 'react';
import { Menu, X, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainLayout({ children, rightPanelContent }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-400 font-body flex w-full relative overflow-x-hidden">
      
      {/* Mobile Header (Glass) */}
      <header className="lg:hidden fixed top-0 w-full h-16 glass-card flex items-center justify-between px-6 z-50 rounded-none border-x-0 border-t-0">
         <button className="text-zinc-300 hover:text-white" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
         <span className="font-black text-white text-xl tracking-[-0.07em] heading-gradient">ProjectSpace</span>
         <button className="text-zinc-300 hover:text-white" onClick={() => setIsRightOpen(!isRightOpen)}>
            <Bell size={20} />
         </button>
      </header>

      {/* Desktop Right Panel Trigger (Glass FAB) */}
      <AnimatePresence>
        {!isRightOpen && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="hidden lg:flex fixed top-8 right-8 p-4 rounded-full glass-card text-zinc-300 hover:text-violet-400 z-40 transition-colors"
            onClick={() => setIsRightOpen(true)}
          >
            <Bell size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Overlay Backdrop */}
      <AnimatePresence>
        {(isSidebarOpen || isRightOpen) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden" 
            onClick={() => {
              setIsSidebarOpen(false);
              setIsRightOpen(false);
            }} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar - collapsible dock */}
      <Sidebar isSidebarOpen={isSidebarOpen} onNavigate={() => setIsSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-20 transition-all duration-500 min-h-screen relative z-10">
        <div className="pt-24 lg:pt-16 px-10 pb-20 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {/* Right Panel Slideout */}
      <RightPanel isOpen={isRightOpen} onClose={() => setIsRightOpen(false)}>
        {rightPanelContent}
      </RightPanel>
    </div>
  );
}
