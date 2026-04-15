import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Zap, Layers, ArrowRight, Share2, Code2, Cpu, Globe, Sprout, HeartPulse } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ShareModal from './ShareModal';
import './ProjectCard.css';

const stageConfig = {
  Idea: { cls: 'stage-idea', icon: Layers },
  Prototype: { cls: 'stage-prototype', icon: Zap },
  Production: { cls: 'stage-production', icon: ArrowRight },
};

const domainIcons = {
  'iot': Cpu,
  'agriculture': Sprout,
  'health': HeartPulse,
  'education': Globe,
  'tech': Code2,
};

// Fallback high-quality images based on domain
const domainImages = {
  tech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800',
  agriculture: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=800',
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
  education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
  robotics: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800',
  ai: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
  default: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800'
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
  
  const getDomainKey = (domain) => {
    const d = domain?.toLowerCase();
    if (d.includes('agri')) return 'agriculture';
    if (d.includes('health') || d.includes('med')) return 'health';
    if (d.includes('edu')) return 'education';
    if (d.includes('robot')) return 'robotics';
    if (d.includes('ai') || d.includes('machine')) return 'ai';
    if (d.includes('iot') || d.includes('internet')) return 'iot';
    return 'tech';
  };

  const domainKey = getDomainKey(mainDomain);
  const DomainIcon = domainIcons[domainKey] || domainIcons.tech;
  const cardImage = project.image || domainImages[domainKey] || domainImages.default;

  return (
    <>
      <Link to={`/project/${project.id}`} className="project-card-v2 glass-card">
        
        {/* TOP: Tags & Meta */}
        <div className="pc2-header">
           <div className="pc2-tags">
              <span className={`pc2-domain-tag domain-${domainKey}`}>
                <DomainIcon size={12} /> {mainDomain}
              </span>
              {project.techStack?.slice(0, 1).map(t => (
                <span key={t} className="pc2-tech-mini">{t}</span>
              ))}
           </div>
           
           {/* Actions overlaying top right */}
           <div className="pc2-actions">
              <button onClick={handleLike} className={`pc2-icon-btn ${isLiked ? 'liked' : ''}`}>
                <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
              </button>
              <button onClick={handleShare} className="pc2-icon-btn">
                <Share2 size={16} />
              </button>
           </div>
        </div>

        {/* MIDDLE: Image */}
        <div className="pc2-image-container">
           <img src={cardImage} alt={project.title} className="pc2-image" loading="lazy" />
        </div>

        {/* BOTTOM: Info */}
        <div className="pc2-footer">
           <h3 className="pc2-title" title={project.title}>{project.title}</h3>
           <div className="pc2-bottom-row">
              <div className={`pc2-stage-pill ${stage.cls}`}>
                <stage.icon size={12} /> {project.stage}
              </div>
              <div className="pc2-meta-likes">
                <Heart size={12} fill="currentColor" /> {localLikes}
              </div>
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
