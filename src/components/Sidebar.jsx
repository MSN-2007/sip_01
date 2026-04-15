import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  User,
  Package,
  Globe,
  BarChart2,
  Share2,
  MessageSquare,
  Settings,
  FileText,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { auth } from '../config/firebase';
import './Sidebar.css';
const NAV_ITEMS = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/profile/u1', icon: User, label: 'Profile' },
  { to: '/explore', icon: Package, label: 'Projects' },
  { to: '/communities', icon: Globe, label: 'Community' },
  { to: '/contributions', icon: BarChart2, label: 'Contributions' },
  { to: '/connects', icon: Share2, label: 'Connects' },
  { to: '/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/resume', icon: Sparkles, label: 'AI Resume' },
];

const BOTTOM_ITEMS = [
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/terms', icon: FileText, label: 'Terms & Conditions' },
];

export default function Sidebar({ onNavigate }) {
  const location = useLocation();
  const { user } = useApp();

  const handleNavigate = () => {
    if (onNavigate) onNavigate();
  };

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path.split('/u1')[0]);

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <Link to="/" className="sidebar-logo">
          <div className="logo-sparkle">
            <Sparkles size={20} fill="#fff" />
          </div>
          <span className="logo-text">ProjectSpace</span>
        </Link>

        <nav className="sidebar-nav">
          <div className="nav-group">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
                  onClick={handleNavigate}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="nav-group bottom">
            {BOTTOM_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`sidebar-link ${isActive(item.to) ? 'active' : ''}`}
                  onClick={handleNavigate}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="sidebar-user" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          {user ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img src={user.avatar} alt={user.name} className="user-avatar" />
                <div className="user-info">
                  <p className="user-name">{user.name}</p>
                  <p className="user-role" style={{ fontSize: '0.7rem' }}>{user.tagline}</p>
                </div>
              </div>
              <button 
                className="btn btn-outline btn-sm" 
                onClick={() => auth.signOut()}
                style={{ width: '100%', fontSize: '0.75rem', padding: '6px' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/login" className="btn btn-primary btn-sm" onClick={handleNavigate} style={{ textAlign: 'center' }}>
                Log In
              </Link>
              <Link to="/signup" className="btn btn-outline btn-sm" onClick={handleNavigate} style={{ textAlign: 'center' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
