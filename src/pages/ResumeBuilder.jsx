import { useMemo, useState, useEffect, useRef } from 'react';
import {
  FileText, Download, Share2, ShieldCheck, Activity, Layers,
  Zap, Rocket, Globe, Cpu, Loader2, CheckCircle2, Sparkles,
  MapPin, Code2, BarChart3, Users, Star, Trophy, Brain
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOCK_ACTIVITY, SDG_GOALS } from '../data/mockData';
import ActivityHeatmap from '../components/ActivityHeatmap';
import ShareModal from '../components/ShareModal';
import './ResumeBuilder.css';

/* ─── Helpers ────────────────────────────────────────────────── */

/** Count how many times each tech appears across all user projects */
function rankTechStack(projects) {
  const freq = {};
  projects.forEach(p => p.techStack.forEach(t => { freq[t] = (freq[t] || 0) + 1; }));
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([tech, count]) => ({ tech, count }));
}

/** Pick the primary language from ranked stack */
function primaryLanguage(ranked) {
  const langs = ['Python', 'JavaScript', 'C++', 'Java', 'Flutter', 'TypeScript'];
  return ranked.find(r => langs.includes(r.tech))?.tech || ranked[0]?.tech || 'various technologies';
}

/** Build a fully personalised AI-style summary */
function buildSummary(user, userProjects, stats, rankedStack) {
  const lang = primaryLanguage(rankedStack);
  const topDomain = userProjects[0]?.domainTags?.[0] || 'Technical Development';
  const topTechs = rankedStack.slice(0, 3).map(r => r.tech).join(', ');
  const prodCount = stats.production;
  const sdgNums = [...new Set(userProjects.flatMap(p => p.sdgTags))].slice(0, 2);
  const sdgLabels = sdgNums.map(n => SDG_GOALS.find(g => g.id === n)?.label).filter(Boolean).join(' and ');

  return `${user.name} is a ${topDomain}-focused builder and problem solver from ${user.location}. ` +
    `With ${stats.total} verified academic projects${prodCount > 0 ? `, ${prodCount} of which are in production,` : ''} ` +
    `they demonstrate end-to-end ownership across design, development, and deployment. ` +
    `Their primary language is ${lang}, with hands-on expertise in ${topTechs}. ` +
    (sdgLabels ? `Their work is aligned with UN SDGs on ${sdgLabels}, reflecting a commitment to real-world impact. ` : '') +
    `Known for their ${user.tagline?.toLowerCase() || 'hands-on approach'}, ` +
    `they are actively seeking collaboration on high-impact projects.`;
}

/* ─── Skill proficiency bar ─────────────────────────────────── */
function SkillBar({ tech, count, max }) {
  const pct = Math.round((count / max) * 100);
  return (
    <div className="skill-bar-row">
      <span className="skill-bar-label">{tech}</span>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="skill-bar-pct">{count} {count === 1 ? 'project' : 'projects'}</span>
    </div>
  );
}

/* ─── SDG badge ─────────────────────────────────────────────── */
function SdgBadge({ id }) {
  const goal = SDG_GOALS.find(g => g.id === id);
  if (!goal) return null;
  return (
    <span className="sdg-mini-badge" style={{ background: goal.color + '22', color: goal.color, borderColor: goal.color + '55' }}>
      SDG {id} · {goal.label}
    </span>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function ResumeBuilder() {
  const { user, projects } = useApp();
  const [isGenerating, setIsGenerating] = useState(true);
  const [loadStep, setLoadStep] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);
  const resumeRef = useRef(null);

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <Brain size={64} style={{ color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>AI Resume Builder</h2>
        <p className="text-muted">You must be logged in to generate your AI profile.</p>
        <a href="/login" className="btn btn-primary" style={{ marginTop: '12px' }}>Log In to Continue</a>
      </div>
    );
  }

  const loadMessages = [
    `Scanning ${user.name}'s project history…`,
    'Ranking technical proficiencies by usage…',
    'Mapping SDG alignment & domain expertise…',
    'Drafting personalised professional summary…',
    'Finalising AI digital profile…',
  ];

  useEffect(() => {
    if (!isGenerating) return;
    const interval = setInterval(() => {
      setLoadStep(prev => {
        if (prev >= loadMessages.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsGenerating(false), 600);
          return prev;
        }
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [isGenerating]);

  /* ── Derived data ── */
  const userProjects = useMemo(() => projects.filter(p => p.userId === user.id), [projects, user.id]);

  const rankedStack = useMemo(() => rankTechStack(userProjects), [userProjects]);

  const stats = useMemo(() => {
    const production = userProjects.filter(p => p.stage === 'Production').length;
    const ideas      = userProjects.filter(p => p.stage === 'Idea').length;
    const prototype  = userProjects.filter(p => p.stage === 'Prototype').length;
    const totalLikes = userProjects.reduce((s, p) => s + (p.likes || 0), 0);
    const totalViews = userProjects.reduce((s, p) => s + (p.views || 0), 0);
    const domains    = new Set(userProjects.flatMap(p => p.domainTags)).size;
    const allSdgs    = [...new Set(userProjects.flatMap(p => p.sdgTags))];
    return { production, ideas, prototype, domains, totalLikes, totalViews, allSdgs, total: userProjects.length };
  }, [userProjects]);

  const summary = useMemo(() => buildSummary(user, userProjects, stats, rankedStack), [user, userProjects, stats, rankedStack]);

  const topDomains = useMemo(() => [...new Set(userProjects.flatMap(p => p.domainTags))], [userProjects]);

  /* ── Download PDF (print-in-new-window) ── */
  const handleDownload = () => {
    if (!resumeRef.current) return;
    setIsDownloading(true);

    const content = resumeRef.current.cloneNode(true);
    // Remove action buttons from clone
    content.querySelectorAll('.resume-no-print, button').forEach(el => el.remove());

    const printWin = window.open('', '_blank', 'width=960,height=700');
    if (!printWin) {
      alert('Please allow popups for this site to download the PDF.');
      setIsDownloading(false);
      return;
    }

    printWin.document.write(`<!DOCTYPE html><html lang="en"><head>
      <meta charset="UTF-8"/>
      <title>${user.name} — Resume</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;800&display=swap" rel="stylesheet"/>
      <style>
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Inter',sans-serif;background:#fff;color:#111827;padding:32px 48px;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact}
        h1,h2,h3,h4,h5{font-family:'Space Grotesk',sans-serif}
        svg{display:inline-block;vertical-align:middle;flex-shrink:0}
        :root{--accent-primary:#6366f1;--text-primary:#111827;--text-secondary:#374151;--text-muted:#6b7280;--border-subtle:#e5e7eb;--bg-elevated:#f9fafb;--bg-input:#f3f4f6;--radius-xl:16px;--radius-2xl:20px;--radius-full:9999px;--radius-lg:12px;--radius-md:8px;--shadow-sm:0 1px 3px rgba(0,0,0,.1);--font-display:'Space Grotesk',sans-serif}
        .resume-dashboard-new{max-width:100%}
        .resume-header-new{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:20px;border-bottom:2px solid #6366f1}
        .resume-id-section{display:flex;flex-direction:column;gap:6px}
        .resume-label-new{font-size:.72rem;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.12em}
        .resume-name-new{font-size:2rem;font-weight:800;color:#111827}
        .resume-tagline-text{font-size:.9rem;color:#6b7280}
        .resume-meta-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
        .resume-meta-chip{display:flex;align-items:center;gap:4px;font-size:.75rem;color:#374151;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:20px;padding:3px 10px}
        .r-impact-badge{background:#d1fae5;color:#065f46;padding:3px 10px;border-radius:20px;font-size:.68rem;font-weight:700;border:1px solid #6ee7b7}
        .resume-stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px}
        .resume-stat-card{padding:14px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px}
        .stat-card-top{display:flex;justify-content:space-between}
        .resume-stat-label{font-size:.68rem;font-weight:700;color:#6b7280;text-transform:uppercase}
        .resume-stat-val{font-size:1.6rem;font-weight:800;color:#111827}
        .stat-card-sub{font-size:.68rem;color:#6b7280}
        .resume-main-layout{display:grid;grid-template-columns:2fr 1fr;gap:28px}
        .resume-section-new{margin-bottom:24px}
        .resume-section-title-new{font-size:.95rem;font-weight:700;margin-bottom:12px;color:#111827;display:flex;align-items:center;gap:8px;padding-bottom:8px;border-bottom:1px solid #e5e7eb}
        .resume-summary-box{padding:16px 20px;background:#eef2ff;border-radius:12px;border:1px solid #c7d2fe;line-height:1.8;color:#374151;font-size:.9rem}
        .resume-project-card{margin-bottom:14px;padding:16px 18px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;page-break-inside:avoid}
        .resume-project-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;gap:10px}
        .resume-project-title-row{display:flex;flex-direction:column;gap:4px}
        .r-problem-title{font-size:.7rem;font-weight:700;color:#6366f1;text-transform:uppercase;letter-spacing:.06em}
        .r-project-name{font-size:1.05rem;font-weight:800;color:#111827}
        .about-text{font-size:.85rem;color:#374151;margin-bottom:8px;line-height:1.6}
        .project-sdg-row{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}
        .sdg-mini-badge{font-size:.62rem;font-weight:700;padding:2px 8px;border-radius:20px;border:1px solid}
        .project-metrics-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px}
        .project-metric{display:flex;align-items:center;gap:4px;font-size:.7rem;color:#6b7280;font-weight:600}
        .resume-tech-list{display:flex;gap:4px;flex-wrap:wrap}
        .r-tech-tag{font-size:.65rem;font-weight:600;background:#f3f4f6;border:1px solid #e5e7eb;padding:2px 8px;border-radius:20px;color:#374151}
        .badge-live{background:#d1fae5;color:#065f46;border-color:#6ee7b7}
        .skill-category-box{background:#f3f4f6;padding:12px;border-radius:12px;border:1px solid #e5e7eb;margin-bottom:10px}
        .skill-cat-title{font-size:.68rem;font-weight:700;margin-bottom:8px;color:#6b7280;text-transform:uppercase}
        .skill-bar-row{display:grid;grid-template-columns:88px 1fr 58px;align-items:center;gap:6px;margin-bottom:5px}
        .skill-bar-label{font-size:.75rem;font-weight:600;color:#374151}
        .skill-bar-track{height:5px;background:#e5e7eb;border-radius:4px;overflow:hidden}
        .skill-bar-fill{height:100%;background:linear-gradient(90deg,#6366f1,#a78bfa);border-radius:4px}
        .skill-bar-pct{font-size:.65rem;color:#6b7280;text-align:right}
        .preferred-lang-badge{display:flex;align-items:center;gap:8px;background:#eef2ff;border:1px solid #c7d2fe;border-radius:12px;padding:10px 14px;font-size:.95rem;font-weight:800;color:#6366f1}
        .skill-chips-row{display:flex;flex-wrap:wrap;gap:5px}
        .domain-pill{font-size:.68rem;font-weight:600;background:#f3f4f6;border:1px solid #e5e7eb;padding:2px 9px;border-radius:20px;color:#374151}
        .resume-skills-grid{display:flex;flex-direction:column;gap:8px}
        .breakdown-row{display:flex;justify-content:space-between;align-items:center;padding:7px 12px;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:10px}
        .breakdown-label{display:flex;align-items:center;gap:6px;font-size:.8rem;color:#374151;font-weight:600}
        .breakdown-val{font-size:1.1rem;font-weight:800;color:#111827}
        .profile-score-card{display:flex;align-items:center;gap:16px;padding:14px 16px;background:#f0fdf4;border:1px solid #86efac;border-radius:14px}
        .score-circle{display:flex;flex-direction:column;align-items:center;justify-content:center;width:60px;height:60px;border-radius:50%;border:3px solid #22c55e;background:#f0fdf4;flex-shrink:0}
        .score-number{font-size:1.2rem;font-weight:800;color:#15803d;line-height:1}
        .score-label{font-size:.6rem;color:#6b7280;font-weight:600}
        .score-title{font-size:.9rem;font-weight:700;color:#111827}
        .resume-section-new:has(.kanban-card){display:none}
        .glass-card{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px}
      </style>
    </head><body>
      ${content.outerHTML}
      <script>window.onload=function(){setTimeout(function(){window.print();window.close();},600);}<\/script>
    </body></html>`);
    printWin.document.close();

    setTimeout(() => {
      setIsDownloading(false);
      setDownloadDone(true);
      setTimeout(() => setDownloadDone(false), 3000);
    }, 1500);
  };

  /* ── Loading screen ── */
  if (isGenerating) {
    return (
      <div className="resume-generating-screen">
        <div className="resume-gen-inner">
          <div className="ai-loader-container">
            <Brain className="spinning-ai-icon" size={52} />
            <div className="ai-pulse-ring" />
            <div className="ai-pulse-ring delay" />
          </div>
          <h2 className="resume-gen-title">AI is building your profile</h2>
          <p className="resume-gen-step">{loadMessages[loadStep]}</p>
          <div className="resume-gen-progress">
            {loadMessages.map((_, i) => (
              <div key={i} className={`resume-gen-dot ${i <= loadStep ? 'active' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ── Main resume ── */
  return (
    <div className="resume-dashboard-new fade-in" id="resume-printable-area" ref={resumeRef}>

      {/* ── Header ── */}
      <header className="resume-header-new">
        <div className="resume-id-section">
          <span className="resume-label-new">
            <Sparkles size={14} style={{ display: 'inline', marginRight: 6 }} />
            AI-Generated Digital Profile
          </span>
          <h1 className="resume-name-new">{user.name}</h1>
          <p className="resume-tagline-text">{user.tagline}</p>
          <div className="resume-meta-row">
            <span className="resume-meta-chip">
              <MapPin size={13} /> {user.location}
            </span>
            <span className="resume-meta-chip">
              <Code2 size={13} /> {primaryLanguage(rankedStack)}
            </span>
            <ShieldCheck size={16} style={{ color: 'var(--accent-primary)' }} />
            <span className="r-impact-badge">Verified Problem Solver</span>
          </div>
        </div>
        <div className="resume-actions-new resume-no-print">
          <button className="btn btn-secondary btn-sm" onClick={() => setIsShareOpen(true)}>
            <Share2 size={15} /> Share Profile
          </button>
          <button
            className={`btn btn-primary btn-sm ${downloadDone ? 'btn-success' : ''}`}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {downloadDone
              ? <><CheckCircle2 size={15} /> Downloaded!</>
              : isDownloading
                ? <><Loader2 size={15} className="spinning-sm" /> Preparing…</>
                : <><Download size={15} /> Download PDF</>}
          </button>
        </div>
      </header>

      {/* ── Stats row ── */}
      <div className="resume-stats-grid">
        <div className="resume-stat-card">
          <div className="stat-card-top"><span className="resume-stat-label">Total Projects</span><Rocket size={16} style={{ opacity: 0.4 }} /></div>
          <span className="resume-stat-val">{stats.total}</span>
          <span className="stat-card-sub">{stats.production} in production</span>
        </div>
        <div className="resume-stat-card">
          <div className="stat-card-top"><span className="resume-stat-label">Total Likes</span><Star size={16} style={{ color: '#fbbf24' }} /></div>
          <span className="resume-stat-val">{stats.totalLikes.toLocaleString()}</span>
          <span className="stat-card-sub">across all projects</span>
        </div>
        <div className="resume-stat-card">
          <div className="stat-card-top"><span className="resume-stat-label">Total Views</span><BarChart3 size={16} style={{ color: 'var(--accent-primary)' }} /></div>
          <span className="resume-stat-val">{stats.totalViews.toLocaleString()}</span>
          <span className="stat-card-sub">project visibility</span>
        </div>
        <div className="resume-stat-card">
          <div className="stat-card-top"><span className="resume-stat-label">SDG Goals</span><Globe size={16} style={{ color: '#10b981' }} /></div>
          <span className="resume-stat-val">{stats.allSdgs.length}</span>
          <span className="stat-card-sub">goals addressed</span>
        </div>
      </div>

      <div className="resume-main-layout">

        {/* ── LEFT COLUMN ── */}
        <div className="resume-left-col">

          {/* AI Summary */}
          <section className="resume-section-new">
            <h3 className="resume-section-title-new"><Activity size={20} /> AI-Written Professional Summary</h3>
            <div className="resume-summary-box">{summary}</div>
          </section>

          {/* Project highlights */}
          <section className="resume-section-new">
            <h3 className="resume-section-title-new"><Layers size={20} /> Project Highlights</h3>
            {userProjects.length > 0 ? userProjects.map(p => (
              <div key={p.id} className="resume-project-card">
                <div className="resume-project-header">
                  <div className="resume-project-title-row">
                    <span className="r-problem-title">{p.problemTitle}</span>
                    <h4 className="r-project-name">{p.title}</h4>
                  </div>
                  <span className={`r-impact-badge ${p.stage === 'Production' ? 'badge-live' : ''}`}>
                    {p.stage === 'Production' ? '🟢 Live' : p.stage === 'Prototype' ? '🟡 Prototype' : '🔵 Idea'}
                  </span>
                </div>
                <p className="about-text" style={{ fontSize: '0.95rem', marginBottom: 16 }}>{p.shortDescription}</p>

                {/* SDG tags */}
                {p.sdgTags?.length > 0 && (
                  <div className="project-sdg-row">
                    {p.sdgTags.map(id => <SdgBadge key={id} id={id} />)}
                  </div>
                )}

                {/* Metrics */}
                <div className="project-metrics-row">
                  <span className="project-metric"><Star size={13} /> {p.likes} likes</span>
                  <span className="project-metric"><Users size={13} /> {p.collaborationRequests} collab requests</span>
                  <span className="project-metric"><BarChart3 size={13} /> {p.views?.toLocaleString()} views</span>
                  {p.contributors && <span className="project-metric"><CheckCircle2 size={13} /> {p.contributors} contributors</span>}
                </div>

                {/* Tech stack */}
                <div className="resume-tech-list">
                  {p.techStack.map(t => <span key={t} className="r-tech-tag">{t}</span>)}
                </div>
              </div>
            )) : (
              <div className="resume-summary-box" style={{ textAlign: 'center', padding: '48px 20px' }}>
                <p className="text-muted">No projects found. Upload your first solution to generate highlights.</p>
              </div>
            )}
          </section>

          {/* Activity heatmap */}
          <section className="resume-section-new">
            <h3 className="resume-section-title-new"><Activity size={20} /> Platform Contribution Heatmap</h3>
            <div className="kanban-card glass-card" style={{ padding: 24 }}>
              <ActivityHeatmap data={MOCK_ACTIVITY} />
            </div>
          </section>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="resume-right-col">

          {/* Top languages (ranked) */}
          <section className="resume-section-new">
            <h3 className="resume-section-title-new"><Cpu size={20} /> Technical Skills</h3>
            <div className="skill-category-box" style={{ marginBottom: 16 }}>
              <h4 className="skill-cat-title">Most Used Technologies</h4>
              {rankedStack.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
                  {rankedStack.slice(0, 8).map(r => (
                    <SkillBar key={r.tech} tech={r.tech} count={r.count} max={rankedStack[0].count} />
                  ))}
                </div>
              ) : <span className="text-muted">No skills mapped yet.</span>}
            </div>

            <div className="skill-category-box" style={{ marginBottom: 16 }}>
              <h4 className="skill-cat-title">Preferred Language</h4>
              <div className="preferred-lang-badge">
                <Code2 size={20} />
                <span>{primaryLanguage(rankedStack)}</span>
              </div>
            </div>

            <div className="skill-category-box">
              <h4 className="skill-cat-title">Verified Domains</h4>
              <div className="skill-chips-row">
                {topDomains.map(d => (
                  <span key={d} className="domain-pill">{d}</span>
                ))}
              </div>
            </div>
          </section>

          {/* SDG alignment */}
          {stats.allSdgs.length > 0 && (
            <section className="resume-section-new">
              <h3 className="resume-section-title-new"><Globe size={20} /> SDG Alignment</h3>
              <div className="skill-category-box">
                <h4 className="skill-cat-title">Goals Addressed</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                  {stats.allSdgs.map(id => <SdgBadge key={id} id={id} />)}
                </div>
              </div>
            </section>
          )}

          {/* Project breakdown */}
          <section className="resume-section-new">
            <h3 className="resume-section-title-new"><Trophy size={20} /> Project Breakdown</h3>
            <div className="resume-skills-grid">
              <div className="breakdown-row">
                <span className="breakdown-label"><Zap size={14} style={{ color: '#10b981' }} /> Production</span>
                <span className="breakdown-val">{stats.production}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label"><Zap size={14} style={{ color: '#fbbf24' }} /> Prototype</span>
                <span className="breakdown-val">{stats.prototype}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label"><Zap size={14} style={{ color: 'var(--accent-primary)' }} /> Idea Stage</span>
                <span className="breakdown-val">{stats.ideas}</span>
              </div>
              <div className="breakdown-row">
                <span className="breakdown-label"><Users size={14} /> Total Collabs</span>
                <span className="breakdown-val">{userProjects.reduce((s, p) => s + (p.collaborationRequests || 0), 0)}</span>
              </div>
            </div>
          </section>

          {/* Profile score */}
          <section className="resume-section-new">
            <h3 className="resume-section-title-new"><ShieldCheck size={20} /> Profile Score</h3>
            <div className="profile-score-card">
              <div className="score-circle">
                <span className="score-number">{user.sdgScore}</span>
                <span className="score-label">/ 100</span>
              </div>
              <div className="score-details">
                <p className="score-title">{user.sdgScore >= 85 ? 'Elite Builder' : user.sdgScore >= 70 ? 'Advanced Builder' : 'Rising Builder'}</p>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 4 }}>
                  Based on projects, impact, SDG alignment & community engagement
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={`${user.name} — AI Professional Profile`}
        url={window.location.href}
        userName={user.name}
        userTagline={user.tagline}
      />
    </div>
  );
}
