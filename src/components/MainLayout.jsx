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
         <span className="mobile-logo-text">ProjectSpace</span>
         <button className="btn-icon" onClick={() => setIsRightOpen(!isRightOpen)}>
            <Bell />
         </button>
      </header>

      {/* Overlay Backdrop for Mobile */}
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
