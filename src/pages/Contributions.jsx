import { useMemo } from 'react';
import { Layers, Zap, Clock, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Profile.css'; // Reusing some profile styles

export default function Contributions() {
  const { user, projects } = useApp();

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <ShieldCheck size={64} style={{ color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Contributions</h2>
        <p className="text-muted">You must be logged in to view your contributions.</p>
        <a href="/login" className="btn btn-primary" style={{ marginTop: '12px' }}>Log In</a>
      </div>
    );
  }

  // Real active contributions based on projects uploaded
  const contributionList = useMemo(() => {
    return projects.filter(p => p.userId === user.id).map(p => ({
      ...p,
      role: 'Creator',
      contributions: p.views ? Math.floor(p.views / 10) : 1, // pseudo-metric for engagement
      lastActivity: p.createdAt || 'Recently'
    }));
  }, [projects, user.id]);

  const stats = {
    total: contributionList.length,
    guided: 0,
    merged: 0,
    score: contributionList.reduce((acc, p) => acc + (p.likes || 0), 0) * 10
  };

  const timeline = contributionList.length > 0 
    ? contributionList.map(p => ({ date: p.createdAt, action: `Published project: ${p.title}` }))
    : [{ date: 'Today', action: `Joined ProjectSpace as ${user.name}` }, { date: 'Next Step', action: 'Upload your first project idea!' }];

  return (
    <div className="home-page-new">
       <header className="home-top-bar">
          <h1 className="section-title-new" style={{ fontSize: '2.5rem' }}>Contributions</h1>
       </header>

       <section className="feed-section">
          <div className="section-header-new">
             <h2 className="section-title-new"><ShieldCheck size={24} style={{ color: 'var(--accent-primary)', marginRight: 8 }} /> My Impact</h2>
          </div>
          <div className="resume-stats-grid">
             <div className="resume-stat-card">
               <span className="resume-stat-label">Total Projects</span>
               <span className="resume-stat-val">{stats.total}</span>
             </div>
             <div className="resume-stat-card">
               <span className="resume-stat-label">Projects Guided</span>
               <span className="resume-stat-val">{stats.guided}</span>
             </div>
             <div className="resume-stat-card">
               <span className="resume-stat-label">PRs Merged</span>
               <span className="resume-stat-val">{stats.merged}</span>
             </div>
             <div className="resume-stat-card">
               <span className="resume-stat-label">Impact Score</span>
               <span className="resume-stat-val">{stats.score}</span>
             </div>
          </div>
       </section>

       <section className="feed-section">
          <div className="section-header-new">
             <h2 className="section-title-new"><Layers size={24} style={{ color: 'var(--accent-secondary)', marginRight: 8 }} /> Contributed Projects</h2>
          </div>
          <div className="horizontal-grid">
             {contributionList.length > 0 ? contributionList.map(p => (
               <div key={p.id} className="kanban-card glass-card" style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                     <span className={`badge-item ${p.role === 'Creator' ? 'badge-ai' : 'badge-tech'}`} style={{ fontSize: '0.7rem' }}>{p.role}</span>
                     <span className="text-muted" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={14} /> {p.lastActivity}
                     </span>
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: 8 }}>{p.title}</h4>
                  <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: 20 }}>{p.shortDescription}</p>
                  
                  <div style={{ padding: '12px 16px', background: 'var(--bg-input)', borderRadius: 12, marginBottom: 20 }}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Engagement</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{p.contributions} operations</span>
                     </div>
                  </div>

                  <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
                    View My Workspace <ArrowRight size={14} />
                  </button>
               </div>
             )) : (
               <div className="empty-state-new" style={{ padding: 48, textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 24, border: '1px dashed var(--border-subtle)', gridColumn: '1 / -1' }}>
                  <Layers size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                  <p className="text-muted">You have no active projects yet. Click Create Project to start building!</p>
               </div>
             )}
          </div>
       </section>

       <section className="feed-section">
          <div className="section-header-new">
             <h2 className="section-title-new"><Clock size={24} style={{ color: 'var(--accent-orange)', marginRight: 8 }} /> Activity Timeline</h2>
          </div>
          <div className="timeline-box" style={{ padding: 32, background: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
             {timeline.map((log, i) => (
               <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: 24, borderLeft: (i === timeline.length - 1) ? 'none' : '2px solid var(--border-subtle)', marginLeft: 10, paddingLeft: 24, position: 'relative' }}>
                  <div style={{ width: 12, height: 12, borderRadius: 6, background: 'var(--accent-primary)', position: 'absolute', left: -7, top: 4 }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: 80 }}>{log.date}</span>
                  <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{log.action}</span>
               </div>
             ))}
          </div>
       </section>
    </div>
  );
}
