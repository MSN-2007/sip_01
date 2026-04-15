import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Eye, Users, Zap, Search, ArrowRight, Layers, Share2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ShareModal from './ShareModal';
import './ProjectCard.css';

const stageConfig = {
  Idea: { cls: 'stage-idea', icon: Layers },
  Prototype: { cls: 'stage-prototype', icon: Zap },
  Production: { cls: 'stage-production', icon: ArrowRight },
};

export default function ProjectCard({ project }) {
  const { likedProjects, toggleLike } = useApp();
  const isLiked = likedProjects.includes(project.id);
  const [localLikes, setLocalLikes] = useState(project.likes);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(project.id);
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareOpen(true);
  };

  const stage = stageConfig[project.stage] || stageConfig.Idea;
  const mainDomain = project.domainTags?.[0] || 'Tech';

  const getDomainColorClass = (domain) => {
    const d = domain?.toLowerCase();
    if (d === 'tech') return 'tech';
    if (d === 'agriculture') return 'agriculture';
    if (d === 'health') return 'health';
    if (d === 'ai') return 'ai';
    if (d === 'robotics') return 'robotics';
    return 'default';
  };

  const domainClass = getDomainColorClass(mainDomain);

  return (
    <>
      <Link to={`/project/${project.id}`} className="project-card-new glass-card">
        <div className={`pc-domain-bar domain-${domainClass}`} />
        
        <div className="pc-content">
          {/* Domain and Stage */}
          <div className="pc-top-meta">
            <span className={`pc-domain-badge badge-${domainClass}`}>{mainDomain}</span>
            <span className={`pc-stage-label ${stage.cls}`}>
               {project.stage}
            </span>
          </div>

          {/* Titles */}
          <div className="pc-titles">
            <h4 className="pc-problem-title">{project.problemTitle}</h4>
            <h3 className="pc-project-name">{project.title}</h3>
          </div>

          <p className="pc-short-desc">{project.shortDescription}</p>

          {/* Metadata Grid */}
          <div className="pc-meta-grid">
             <div className="pc-meta-item">
               <span className="pc-meta-label">Team size</span>
               <span className="pc-meta-val"><Users size={12} /> {project.contributors || 1} members</span>
             </div>
             <div className="pc-meta-item">
               <span className="pc-meta-label">Skills needed</span>
               <div className="pc-skills-list">
                 {project.techStack.slice(0, 2).map(skill => (
                   <span key={skill} className="pc-skill-tag">{skill}</span>
                 ))}
                 {project.techStack.length > 2 && <span className="pc-skill-more">+{project.techStack.length - 2}</span>}
               </div>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="pc-footer-new">
             <div className="pc-stats-row">
               <button onClick={handleLike} className={`pc-heart-btn ${isLiked ? 'liked' : ''}`}>
                 <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                 <span>{localLikes}</span>
               </button>
               <button onClick={handleShare} className="pc-heart-btn">
                 <Share2 size={16} />
                 <span>Share</span>
               </button>
               <div className="pc-views-stat">
                 <Eye size={16} />
                 <span>{(project.views / 1000).toFixed(1)}k</span>
               </div>
             </div>

             <button className="btn btn-primary pc-join-btn">
                Join Project
             </button>
          </div>
        </div>
      </Link>

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={project.title}
        url={`${window.location.origin}/project/${project.id}`}
      />
    </>
  );
}
