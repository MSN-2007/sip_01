import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Heart, Eye, Users, Share2, ExternalLink, Zap,
  Globe, FileText, CheckCircle, ChevronRight, MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SDG_GOALS } from '../data/mockData';
import ShareModal from '../components/ShareModal';
import './ProjectDetail.css';

const stageConfig = {
  Idea: { cls: 'stage-idea', dot: '#f5c842' },
  Prototype: { cls: 'stage-prototype', dot: '#ff7c4c' },
  Production: { cls: 'stage-production', dot: '#00d4aa' },
};

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, users, likedProjects, toggleLike, following, toggleFollow, user } = useApp();
  const project = projects.find(p => p.id === id);
  const [showCollabModal, setShowCollabModal] = useState(false);
  const [collabMsg, setCollabMsg] = useState('');
  const [collabSent, setCollabSent] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!project) {
    return (
      <div className="page-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div className="empty-state">
          <p>Project not found.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const isLiked = user ? likedProjects.includes(project.id) : false;
  const isFollowing = user ? following.includes(project.userId) : false;
  const isOwn = user && project.userId === user.id;
  const stage = stageConfig[project.stage] || stageConfig.Idea;
  const sdgs = SDG_GOALS.filter(g => project.sdgTags?.includes(g.id));
  const relatedProjects = projects.filter(p => p.id !== id && p.domainTags.some(d => project.domainTags.includes(d))).slice(0, 2);

  const handleLikeClick = () => {
    if (!user) {
      alert("Please log in to like this project.");
      return;
    }
    toggleLike(project.id);
  };

  const handleCollabClick = () => {
    if (!user) {
      alert("Please log in to collaborate on projects.");
      return;
    }
    setShowCollabModal(true);
  };

  const handleFollowClick = () => {
    if (!user) {
      alert("Please log in to follow builders.");
      return;
    }
    toggleFollow(project.userId);
  };

  const sendCollabRequest = () => {
    setCollabSent(true);
    setTimeout(() => { setShowCollabModal(false); setCollabSent(false); setCollabMsg(''); }, 2000);
  };

  return (
    <>
      <div className="page-content pd-page fade-in">
        {/* Breadcrumb */}
        <div className="container pd-nav">
          <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
            <ArrowLeft size={16} />Back
          </button>
          <nav className="pd-breadcrumb">
            <Link to="/">Feed</Link>
            <ChevronRight size={12} />
            <span>{project.title}</span>
          </nav>
        </div>

        <div className="home-layout">
          {/* Main */}
          <main className="pd-main">
            {/* Hero */}
            <div className="pd-hero glass-card">
              <div className="pd-hero-top">
                <div className="pd-meta">
                  <span className={`stage-badge ${stage.cls}`}>
                    <span className="stage-dot" style={{ background: stage.dot }} />
                    {project.stage}
                  </span>
                  {project.domainTags.map(d => (
                    <span key={d} className="chip chip-domain">{d}</span>
                  ))}
                </div>
                <div className="pd-actions-top">
                  <button className="btn btn-ghost btn-sm" onClick={() => setIsShareOpen(true)}>
                    <Share2 size={15} />Share
                  </button>
                </div>
              </div>
              <h1 className="pd-title">{project.title}</h1>
              <p className="pd-short-desc">{project.shortDescription}</p>

              {/* Stats */}
              <div className="pd-stats-row">
                <span className="pd-stat"><Heart size={15} /> {project.likes.toLocaleString()} likes</span>
                <span className="pd-stat"><Eye size={15} /> {project.views.toLocaleString()} views</span>
                <span className="pd-stat"><Users size={15} /> {project.collaborationRequests} requests</span>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="glass-card pd-section">
              <h3 className="pd-section-title">⚡ Tech Stack</h3>
              <div className="pd-chips-row">
                {project.techStack.map(t => (
                  <span key={t} className="chip chip-tech">{t}</span>
                ))}
              </div>
            </div>

            {/* Long Description */}
            <div className="glass-card pd-section">
              <h3 className="pd-section-title">📖 About This Project</h3>
              <div className="pd-long-desc">
                {project.longDescription.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Alternative Uses */}
            {project.alternativeUses?.length > 0 && (
              <div className="glass-card pd-section">
                <h3 className="pd-section-title">🔄 Alternative Uses</h3>
                <ul className="pd-alt-uses">
                  {project.alternativeUses.map((use, i) => (
                    <li key={i}>
                      <CheckCircle size={15} className="alt-check" />
                      {use}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Proof of Work */}
            <div className="glass-card pd-section">
              <h3 className="pd-section-title">🧪 Proof of Work</h3>
              <div className="pd-proof">
                {project.proofOfWork.videoUrl && (
                  <a href={project.proofOfWork.videoUrl} target="_blank" rel="noreferrer" className="proof-item">
                    <Globe size={16} /> Watch Demo Video <ExternalLink size={12} />
                  </a>
                )}
                {project.proofOfWork.patentNumber && (
                  <div className="proof-item">
                    <FileText size={16} /> Patent: {project.proofOfWork.patentNumber}
                  </div>
                )}
                {!project.proofOfWork.videoUrl && !project.proofOfWork.patentNumber && (
                  <p className="pd-no-proof">No proof of work links added yet.</p>
                )}
              </div>
            </div>

            {/* SDG Impact */}
            {sdgs.length > 0 && (
              <div className="glass-card pd-section">
                <h3 className="pd-section-title">🌍 SDG Impact</h3>
                <div className="pd-sdg-grid">
                  {sdgs.map(g => (
                    <div key={g.id} className="sdg-card" style={{ borderColor: g.color }}>
                      <div className="sdg-num" style={{ background: g.color }}>SDG {g.id}</div>
                      <p className="sdg-label">{g.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="home-right-sidebar">
            {/* Builder */}
            <div className="sidebar-card">
              <p className="pd-sidebar-label">Posted by</p>
              <Link to={`/profile/${project.userId}`} className="pd-builder">
                <img src={project.user.avatar} alt={project.user.name} className="avatar" style={{ width: 48, height: 48 }} />
                <div>
                  <p className="pdb-name">{project.user.name}</p>
                  <p className="pdb-tag">{project.user.tagline}</p>
                  <p className="pdb-loc">📍 {project.user.location}</p>
                </div>
              </Link>
              <div className="pd-builder-stats">
                <div className="pdb-stat">
                  <span className="stat-value">{project.user.projects}</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="pdb-stat">
                  <span className="stat-value">{project.user.followers.toLocaleString()}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="pdb-stat">
                  <span className="stat-value">{project.user.sdgScore}</span>
                  <span className="stat-label">SDG Score</span>
                </div>
              </div>
              {!isOwn && (
                <div className="pd-builder-actions">
                  <button
                    className={`btn btn-sm ${isFollowing ? 'btn-ghost' : 'btn-primary'}`}
                    style={{ flex: 1, borderRadius: '9999px' }}
                    onClick={handleFollowClick}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <Link to="/messages" className="btn btn-ghost btn-sm btn-icon" style={{ borderRadius: '9999px' }}>
                    <MessageSquare size={16} />
                  </Link>
                </div>
              )}
            </div>

            {/* CTA */}
            {!isOwn && (
              <div className="sidebar-card mt-3">
                <p className="pd-sidebar-label">Collaborate</p>
                <p className="pd-cta-desc">
                  {project.stage === 'Production'
                    ? "This project is in production. Contribute your skills to help improve it."
                    : "This project is looking for collaborators. Join the builder!"}
                </p>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', borderRadius: '9999px' }}
                  onClick={handleCollabClick}
                >
                  <Zap size={16} />
                  {project.collaborationCTA}
                </button>
                <button
                  className={`btn ${isLiked ? 'btn-ghost' : 'btn-secondary'}`}
                  style={{ width: '100%', justifyContent: 'center', borderRadius: '9999px' }}
                  onClick={handleLikeClick}
                >
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} style={{ color: isLiked ? '#ff6b6b' : 'currentColor' }} />
                  {isLiked ? 'Liked' : 'Like This Project'}
                </button>
              </div>
            )}

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="sidebar-card mt-3">
                <p className="pd-sidebar-label">Related Projects</p>
                {relatedProjects.map(rp => (
                  <Link key={rp.id} to={`/project/${rp.id}`} className="related-item">
                    <div>
                      <p className="ri-title">{rp.title}</p>
                      <p className="ri-user">{rp.user.name}</p>
                    </div>
                    <ChevronRight size={14} />
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>

        {/* Collab Modal */}
        {showCollabModal && (
          <div className="modal-overlay" onClick={() => setShowCollabModal(false)}>
            <div className="modal glass-card" onClick={e => e.stopPropagation()}>
              {collabSent ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CheckCircle size={48} color="var(--accent-secondary)" />
                  <p style={{ marginTop: 12, fontWeight: 700 }}>Request Sent!</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {project.user.name} will be notified.
                  </p>
                </div>
              ) : (
                <>
                  <h3>{project.collaborationCTA}</h3>
                  <p className="modal-subtitle">Send a message to {project.user.name} about collaborating on "{project.title}"</p>
                  <textarea
                    className="form-input"
                    rows={4}
                    placeholder="Tell them what you bring to the table — skills, ideas, availability..."
                    value={collabMsg}
                    onChange={e => setCollabMsg(e.target.value)}
                  />
                  <div className="modal-actions">
                    <button className="btn btn-ghost" onClick={() => setShowCollabModal(false)}>Cancel</button>
                    <button className="btn btn-primary" onClick={sendCollabRequest} disabled={!collabMsg.trim()}>
                      <Zap size={16} /> Send Request
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={project.title}
        url={window.location.href}
      />
    </>
  );
}
