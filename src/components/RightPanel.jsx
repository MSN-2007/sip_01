import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Briefcase, 
  UserPlus, 
  Plus, 
  Globe, 
  Search, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './RightPanel.css';

export default function RightPanel() {
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

  return (
    <aside className="right-panel">
      <div className="rp-inner">
        
        {/* Community Search Section - NEW */}
        <section className="rp-section">
           <div className="rp-section-header">
             <h3 className="rp-section-title"><Globe size={18} /> Discovery</h3>
           </div>
           <form className="rp-search-form" onSubmit={handleCommSearch}>
              <div className="rp-search-input-wrapper">
                 <Search size={14} className="rp-search-icon" />
                 <input 
                   type="text" 
                   placeholder="Find a community..." 
                   className="rp-search-input"
                   value={commSearch}
                   onChange={(e) => setCommSearch(e.target.value)}
                 />
                 <button type="submit" className="rp-search-btn">
                   <ArrowRight size={14} />
                 </button>
              </div>
           </form>
        </section>

        {/* Notifications Section */}
        <section className="rp-section">
          <div className="rp-section-header">
            <h3 className="rp-section-title"><Bell size={18} /> Notifications</h3>
            {unreadCount > 0 && <span className="rp-badge">{unreadCount}</span>}
          </div>
          <div className="rp-list">
            {notifications.length > 0 ? (
              notifications.slice(0, 3).map((n) => (
                <div key={n.id} className={`rp-item ${!n.read ? 'unread' : ''}`} onClick={() => navigate('/notifications')}>
                  <div className="rp-item-icon">
                    {n.type === 'collaboration' ? <UserPlus size={14} /> : <Globe size={14} />}
                  </div>
                  <div className="rp-item-content">
                    <p className="rp-item-text">{n.text}</p>
                    <span className="rp-item-time">{n.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="rp-empty-small">No recent notifications</div>
            )}
            <button className="rp-view-all" onClick={() => navigate('/notifications')}>View all notifications</button>
          </div>
        </section>

        {/* Active Projects Section */}
        <section className="rp-section">
          <div className="rp-section-header">
            <h3 className="rp-section-title"><Briefcase size={18} /> Active Projects</h3>
          </div>
          <div className="rp-list">
            {activeProjects.map((p) => (
              <div key={p.id} className="rp-project-card" onClick={() => navigate(`/project/${p.id}`)}>
                <div className="rp-project-info">
                  <p className="rp-project-name">{p.title}</p>
                  <span className={`rp-project-stage stage-${p.stage.toLowerCase()}`}>{p.stage}</span>
                </div>
                <ArrowRight size={14} />
              </div>
            ))}
            {activeProjects.length === 0 && <div className="rp-empty-small">No active projects</div>}
            <button className="rp-view-all" onClick={() => navigate(user ? `/profile/${user.id}` : '/login')}>Manage all projects</button>
          </div>
        </section>

        {/* Join Requests Section */}
        <section className="rp-section">
          <div className="rp-section-header">
            <h3 className="rp-section-title"><UserPlus size={18} /> Join Requests</h3>
          </div>
          <div className="rp-empty-state" style={{ padding: '20px 12px' }}>
            <p style={{ fontSize: '0.8rem' }}>No pending requests.</p>
          </div>
        </section>

        {/* Quick Actions Section */}
        <div className="rp-quick-actions">
          <p className="rp-quick-label">Quick Actions</p>
          <div className="rp-action-grid">
            <button className="btn btn-primary rp-action-btn" onClick={() => navigate('/upload')}>
              <Plus size={16} /> Create Project
            </button>
            <button className="btn btn-secondary rp-action-btn" onClick={() => navigate('/communities')}>
              <Globe size={16} /> Join Community
            </button>
            <button className="btn btn-tertiary rp-action-btn" onClick={() => navigate('/explore')} style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
              <Search size={16} /> Find Collaborators
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
