import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass, Users, MessageSquare, Bell, User, Plus,
  Sparkles, Search, MoreHorizontal,
  Home, Moon, Sun
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auth } from '../config/firebase';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const { user, notifications, theme, toggleTheme } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/explore', icon: Compass, label: 'Explore' },
    { to: '/communities', icon: Users, label: 'Communities' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: unreadCount },
    { to: '/profile/u1', icon: User, label: 'Profile' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="navbar-sidebar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <Sparkles size={24} color="#fff" />
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="navbar-links">
          {navLinks.map(({ to, icon: Icon, label, badge }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${isActive(to) ? 'active' : ''}`}
            >
              <div className="nav-icon-wrapper">
                <Icon size={26} strokeWidth={isActive(to) ? 2.5 : 1.8} />
                {badge > 0 && <span className="nav-badge">{badge}</span>}
              </div>
              <span className="nav-label">{label}</span>
            </Link>
          ))}

          {/* Theme Toggle */}
          <button className="nav-link theme-toggle" onClick={toggleTheme}>
            <div className="nav-icon-wrapper">
              {theme === 'dark' ? <Sun size={26} /> : <Moon size={26} />}
            </div>
            <span className="nav-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </nav>

        {/* Post Button */}
        <Link to="/upload" className="btn btn-primary post-btn">
          <Plus size={24} className="mobile-icon" />
          <span className="desktop-text">Post</span>
        </Link>

        {/* User Menu */}
        <div className="user-menu-wrapper mt-auto">
          {user ? (
            <>
              <button
                className="user-menu-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
               <div className="user-menu-btn-content">
                 <img src={user.avatar} alt={user.name} className="avatar" style={{ width: 40, height: 40 }} />
                 <div className="user-info-text">
                   <p className="user-name">{user.name}</p>
                   <p className="user-handle">{user?.tagline?.substring(0, 15)}...</p>
                 </div>
                 <MoreHorizontal size={18} className="chevron" />
               </div>
              </button>

              {showUserMenu && (
                <div className="dropdown user-dropdown">
                   <Link to="/resume" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <Sparkles size={18} /> Resume Builder
                    {!user.isPremium && <span className="dropdown-badge">Premium</span>}
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                    <Settings size={18} /> Settings
                  </Link>
                  <div className="divider" />
                  <button className="dropdown-item logout" onClick={() => auth.signOut()}>
                    Log out @{user.name.replace(/\s+/g, '').toLowerCase()}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px' }}>
              <Link to="/login" className="btn btn-primary btn-sm" style={{ textAlign: 'center' }}>
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
