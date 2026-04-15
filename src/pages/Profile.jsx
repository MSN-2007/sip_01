import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  Users, 
  Zap, 
  Rocket, 
  Plus, 
  ChevronRight,
  Clock,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_ACTIVITY } from '../data/mockData';
import ActivityHeatmap from '../components/ActivityHeatmap';
import './Profile.css';

const stageConfig = {
  Idea: { cls: 'stage-idea', icon: Layers, color: '#f5c842' },
  Prototype: { cls: 'stage-prototype', icon: Zap, color: '#ff7c4c' },
  Production: { cls: 'stage-production', icon: Rocket, color: '#00d4aa' },
};

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, users, user: currentUser } = useApp();

  const user = useMemo(() => {
    return users.find(u => u.id === id) || currentUser;
  }, [id, users, currentUser]);

  const userProjects = useMemo(() => {
    return projects.filter(p => p.userId === user.id);
  }, [projects, user.id]);

  const groupedProjects = useMemo(() => {
    return {
      Idea: userProjects.filter(p => p.stage === 'Idea'),
      Prototype: userProjects.filter(p => p.stage === 'Prototype'),
      Production: userProjects.filter(p => p.stage === 'Production'),
    };
  }, [userProjects]);

  const stats = {
    total: userProjects.length,
    contributions: 14, // Mock
    communities: 6, // Mock
  };

  return (
    <div className="profile-container-new">
      {/* Identity Section */}
      <header className="profile-header-new">
        <div className="profile-banner" />
        <div className="profile-identity-card">
          <div className="profile-main-info">
            <div className="avatar-stack">
              <img src={user.avatar} alt={user.name} className="profile-avatar-large" />
            </div>
            <div className="profile-meta">
              <div className="profile-name-row">
                <h1 className="profile-name-new">{user.name}</h1>
                <span className="profile-handle">@{user.name.replace(/\s+/g, '').toLowerCase()}</span>
                <ShieldCheck size={20} style={{ color: 'var(--accent-primary)', marginLeft: 4 }} />
              </div>
              <p className="profile-tagline-new">{user.tagline}</p>
              
              <div className="profile-badges">
                <div className="badge-item"><ShieldCheck size={14} /> Verified</div>
                <div className="badge-item"><Award size={14} /> Top Builder</div>
                <div className="badge-item"><Users size={14} /> Active Collaborator</div>
                <div className="badge-item"><Rocket size={14} /> {groupedProjects.Production.length} Production Projects</div>
              </div>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/upload')}>
              <Plus size={18} /> Create Project
            </button>
          </div>

          <div className="profile-stats-row">
            <div className="stat-item-new">
              <span className="stat-val">{stats.total}</span>
              <span className="stat-label">Total Projects</span>
            </div>
            <div className="stat-item-new">
              <span className="stat-val">{stats.contributions}</span>
              <span className="stat-label">Contributions</span>
            </div>
            <div className="stat-item-new">
              <span className="stat-val">{stats.communities}</span>
              <span className="stat-label">Communities</span>
            </div>
          </div>

          <div className="profile-about-box">
             <h3 className="about-title">About</h3>
             <p className="about-text">
               Passionate builder focused on solving real-world problems through technology. 
               Specializing in IoT, sustainable agriculture, and AI-driven solutions for impact.
             </p>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="profile-content-new">
        
        {/* Activity Heatmap */}
        <ActivityHeatmap data={MOCK_ACTIVITY} />

        {/* Project Board (Kanban) */}
        <section className="kanban-section">
           <h2 className="kanban-section-title"><Layers size={24} /> Project Board</h2>
           
           <div className="kanban-board-new">
              {Object.entries(groupedProjects).map(([stage, list]) => {
                const config = stageConfig[stage];
                return (
                  <div key={stage} className="kanban-column-new">
                    <div className="column-header-new">
                      <div className="column-title-new" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <config.icon size={16} style={{ color: config.color }} />
                        {stage}
                      </div>
                      <span className="column-count-new">{list.length}</span>
                    </div>

                    <div className="column-cards-new" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {list.map(project => (
                        <div 
                          key={project.id} 
                          className="kanban-card glass-card"
                          onClick={() => navigate(`/project/${project.id}`)}
                          style={{ cursor: 'pointer', padding: 20 }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                            <span className="badge badge-tech" style={{ fontSize: '0.7rem' }}>{project.domainTags[0]}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                              <Clock size={12} /> {project.createdAt}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{project.title}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16, lineClamp: 2 }}>{project.shortDescription}</p>
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
                            <div style={{ display: 'flex', marginLeft: 8 }}>
                               {/* Mock avatars */}
                               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="avatar" style={{ width: 24, height: 24, border: '2px solid var(--bg-card)', marginLeft: -8 }} />
                               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" className="avatar" style={{ width: 24, height: 24, border: '2px solid var(--bg-card)', marginLeft: -8 }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                              Details <ChevronRight size={14} />
                            </span>
                          </div>
                        </div>
                      ))}
                      {list.length === 0 && (
                        <div className="empty-column" style={{ padding: 32, textAlign: 'center', border: '1px dashed var(--border-subtle)', borderRadius: 12, color: 'var(--text-muted)' }}>
                          No projects in {stage}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
           </div>
        </section>
      </div>
    </div>
  );
}
