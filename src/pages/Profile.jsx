import { useMemo, useState, useEffect } from 'react';
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
  const { projects, user: currentUser } = useApp();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the requested user profile from Firestore, or use logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      // If this is the currently logged-in user, use their context data directly
      if (currentUser && currentUser.id === id) {
        setProfileUser(currentUser);
        setLoading(false);
        return;
      }
      try {
        const { getUserProfile } = await import('../services/db');
        const doc = await getUserProfile(id);
        if (doc) {
          setProfileUser(doc);
        } else {
          // Firestore returned nothing — fall back to mock data for demo
          const { mockUsers } = await import('../data/mockData');
          const mockUser = mockUsers.find(u => u.id === id);
          setProfileUser(mockUser || null);
        }
      } catch (err) {
        console.error("Failed to load profile", err);
        // Even on error, try mock data so the demo still works
        const { mockUsers } = await import('../data/mockData');
        const mockUser = mockUsers.find(u => u.id === id);
        setProfileUser(mockUser || null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, currentUser]);
  const [banner, setBanner] = useState(profileUser?.banner || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)');
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  const isOwn = currentUser && currentUser.uid === id;

  const handleBannerChange = (newBanner) => {
    setBanner(newBanner);
    setIsBannerModalOpen(false);
    // In a real app, you'd save this to Firebase here
  };

  const userProjects = useMemo(() => {
    if (!profileUser) return [];
    return projects.filter(p => p.userId === profileUser.id);
  }, [projects, profileUser]);

  const userActivity = useMemo(() => {
    if (!userProjects.length) return [];
    
    const counts = {};
    userProjects.forEach(p => {
      // Ensure we have a valid ISO date for the heatmap
      const dateRaw = p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000) : new Date(p.createdAt || Date.now());
      const date = dateRaw.toISOString().split('T')[0];
      if (date) {
        counts[date] = (counts[date] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([date, count]) => ({ date, count }));
  }, [userProjects]);

  // ... (stats and badges logic same as before)
  const groupedProjects = useMemo(() => {
    return {
      Idea: userProjects.filter(p => p.stage === 'Idea'),
      Prototype: userProjects.filter(p => p.stage === 'Prototype'),
      Production: userProjects.filter(p => p.stage === 'Production'),
    };
  }, [userProjects]);

  const stats = {
    total: userProjects.length,
    contributions: userProjects.reduce((acc, p) => acc + (p.contributors || 0), 0),
    communities: profileUser?.joinedCommunities?.length || 0,
  };

  const badges = useMemo(() => {
    const list = [];
    if (!profileUser) return list;
    if (profileUser.name && profileUser.avatar) list.push({ id: 'verified', label: 'Verified', Icon: ShieldCheck });
    if (userProjects.length >= 10) list.push({ id: 'top-builder', label: 'Top Builder', Icon: Award });
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const earliestProjectDate = userProjects.length > 0 
      ? Math.min(...userProjects.map(p => {
          const d = p.createdAt?.seconds ? new Date(p.createdAt.seconds * 1000) : new Date(p.createdAt || Date.now());
          return d.getTime();
        })) 
      : null;
    if (userProjects.length >= 1 && earliestProjectDate && (Date.now() - earliestProjectDate) >= thirtyDaysInMs) {
      list.push({ id: 'active', label: 'Active Collaborator', Icon: Users });
    }
    if (groupedProjects.Production.length > 0) {
      list.push({ id: 'prod', label: `${groupedProjects.Production.length} Shipped`, Icon: Rocket });
    }
    return list;
  }, [profileUser, userProjects, groupedProjects.Production]);

  if (loading) return <div className="profile-container-new">Loading...</div>;
  if (!profileUser) return <div className="profile-container-new">Not Found</div>;

  const user = profileUser;

  return (
    <div className="profile-container-new">
      <header className="profile-header-new">
        <div 
          className="profile-banner-new" 
          style={{ background: banner, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {isOwn && (
            <button className="btn-change-banner" onClick={() => setIsBannerModalOpen(true)}>
              <Camera size={16} /> Change Banner
            </button>
          )}
        </div>
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
                {badges.map(badge => {
                  const Icon = badge.Icon;
                  return (
                    <div key={badge.id} className="badge-item">
                      <Icon size={14} /> {badge.label}
                    </div>
                  );
                })}
              </div>
            </div>
            {isOwn && (
              <button className="btn btn-primary" onClick={() => navigate('/upload')}>
                <Plus size={18} /> Create Project
              </button>
            )}
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
        <ActivityHeatmap data={userActivity} />

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
