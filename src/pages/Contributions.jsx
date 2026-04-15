import { useMemo } from 'react';
import { Layers, Zap, Clock, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Profile.css'; // Reusing some profile styles

export default function Contributions() {
  const { user, projects } = useApp();

  // Mock highly active contributions for demonstration
  const contributionList = useMemo(() => {
    return projects.slice(0, 4).map((p, i) => ({
      ...p,
      role: i === 0 ? 'Creator' : 'Contributor',
      contributions: Math.floor(Math.random() * 15) + 5,
      lastActivity: '2 days ago'
    }));
  }, [projects]);

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
               <span className="resume-stat-label">Total Contributions</span>
               <span className="resume-stat-val">124</span>
             </div>
             <div className="resume-stat-card">
               <span className="resume-stat-label">Projects Guided</span>
               <span className="resume-stat-val">8</span>
             </div>
             <div className="resume-stat-card">
               <span className="resume-stat-label">PRs Merged</span>
               <span className="resume-stat-val">42</span>
             </div>
             <div className="resume-stat-card">
               <span className="resume-stat-label">Impact Score</span>
               <span className="resume-stat-val">940</span>
             </div>
          </div>
       </section>

       <section className="feed-section">
          <div className="section-header-new">
             <h2 className="section-title-new"><Layers size={24} style={{ color: 'var(--accent-secondary)', marginRight: 8 }} /> Contributed Projects</h2>
          </div>
          <div className="horizontal-grid">
             {contributionList.map(p => (
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
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{p.contributions} logs</span>
                     </div>
                  </div>

                  <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.85rem' }}>
                    View My Workspace <ArrowRight size={14} />
                  </button>
               </div>
             ))}
          </div>
       </section>

       <section className="feed-section">
          <div className="section-header-new">
             <h2 className="section-title-new"><Clock size={24} style={{ color: 'var(--accent-orange)', marginRight: 8 }} /> Activity Timeline</h2>
          </div>
          <div className="timeline-box" style={{ padding: 32, background: 'var(--bg-elevated)', borderRadius: 24, border: '1px solid var(--border-subtle)' }}>
             {[
               { date: 'Today', action: 'Submitted major update to SoilSense UI' },
               { date: 'Yesterday', action: 'Accepted as Contributor in RetinaScan AI' },
               { date: 'Mar 24', action: 'Brainstormed solution for IoT Farmers problem' },
               { date: 'Mar 20', action: 'Published first Idea: RainPredict' },
             ].map((log, i) => (
               <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: 24, borderLeft: '2px solid var(--border-subtle)', marginLeft: 10, paddingLeft: 24, position: 'relative' }}>
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
