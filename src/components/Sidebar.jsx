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

        <div className="sidebar-user">
          <img src={user.avatar} alt={user.name} className="user-avatar" />
          <div className="user-info">
            <p className="user-name">{user.name}</p>
            <p className="user-role">Premium Member</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
