import { useState } from 'react';
import { Menu, X, ArrowRight, Bell } from 'lucide-react';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';
import './MainLayout.css';

export default function MainLayout({ children, rightPanelContent }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  return (
    <div className={`main-layout-wrapper ${isSidebarOpen ? 'sidebar-open' : ''} ${isRightOpen ? 'right-open' : ''}`}>
      
      {/* Mobile Header */}
      <header className="mobile-top-nav">
         <button className="btn-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            {isSidebarOpen ? <X /> : <Menu />}
         </button>
         <span className="mobile-logo-text">AcaDify</span>
         <button className="btn-icon" onClick={() => setIsRightOpen(!isRightOpen)}>
            <Bell />
         </button>
      </header>

      {/* Desktop Right Panel Toggle */}
      <button 
        className={`desktop-right-toggle ${isRightOpen ? 'hidden' : ''}`}
        onClick={() => setIsRightOpen(true)}
      >
        <Bell size={20} />
        {/* We could add an unread badge here if we had access to notifications context, but leaving simple for now */}
      </button>

      {/* Overlay Backdrop */}
      {(isSidebarOpen || isRightOpen) && (
        <div 
          className="layout-overlay" 
          onClick={() => {
            setIsSidebarOpen(false);
            setIsRightOpen(false);
          }} 
        />
      )}

      <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      
      <main className="main-content-area">
        {children}
      </main>

      <RightPanel>
        {rightPanelContent}
      </RightPanel>
    </div>
  );
}
