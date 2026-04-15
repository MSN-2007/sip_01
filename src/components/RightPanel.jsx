import { Bell, Briefcase, UserPlus, Plus, Globe, Search, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './RightPanel.css';

export default function RightPanel() {
  const { notifications, projects, user } = useApp();
  const unreadCount = notifications.filter(n => !n.read).length;
  const activeProjects = projects.filter(p => p.stage === 'Prototype' || p.stage === 'Production').slice(0, 2);

  return (
    <aside className="right-panel">
      <div className="rp-inner">
        {/* Notifications Section */}
        <section className="rp-section">
          <div className="rp-section-header">
            <h3 className="rp-section-title"><Bell size={18} /> Notifications</h3>
            {unreadCount > 0 && <span className="rp-badge">{unreadCount}</span>}
          </div>
          <div className="rp-list">
            {notifications.slice(0, 3).map((n) => (
              <div key={n.id} className={`rp-item ${!n.read ? 'unread' : ''}`}>
                <div className="rp-item-icon">
                  {n.type === 'collaboration' ? <UserPlus size={14} /> : <Globe size={14} />}
                </div>
                <div className="rp-item-content">
                  <p className="rp-item-text">{n.text}</p>
                  <span className="rp-item-time">{n.time}</span>
                </div>
              </div>
            ))}
            <button className="rp-view-all">View all notifications</button>
          </div>
        </section>

        {/* Active Projects Section */}
        <section className="rp-section">
          <div className="rp-section-header">
            <h3 className="rp-section-title"><Briefcase size={18} /> Active Projects</h3>
          </div>
          <div className="rp-list">
            {activeProjects.map((p) => (
              <div key={p.id} className="rp-project-card">
                <div className="rp-project-info">
                  <p className="rp-project-name">{p.title}</p>
                  <span className={`rp-project-stage stage-${p.stage.toLowerCase()}`}>{p.stage}</span>
                </div>
                <ArrowRight size={14} />
              </div>
            ))}
            <button className="rp-view-all">Manage all projects</button>
          </div>
        </section>

        {/* Join Requests Section */}
        <section className="rp-section">
          <div className="rp-section-header">
            <h3 className="rp-section-title"><UserPlus size={18} /> Join Requests</h3>
          </div>
          <div className="rp-empty-state">
            <p>No pending requests.</p>
          </div>
        </section>

        {/* Quick Actions Section */}
        <div className="rp-quick-actions">
          <p className="rp-quick-label">Quick Actions</p>
          <div className="rp-action-grid">
            <button className="btn btn-primary rp-action-btn">
              <Plus size={16} /> Create Project
            </button>
            <button className="btn btn-secondary rp-action-btn">
              <Globe size={16} /> Join Community
            </button>
            <button className="btn btn-secondary rp-action-btn">
              <Search size={16} /> Find Collaborators
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
