import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, X, Eye, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ShareModal from './ShareModal';

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { likedProjects, toggleLike, user, deleteProject } = useApp();
  const isLiked = likedProjects.includes(project.id);
  const isOwner = user && project.userId === user.id;
  const [localLikes, setLocalLikes] = useState(project.likes);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    toggleLike(project.id);
    setLocalLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsShareOpen(true);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${project.title}" forever? This cannot be undone.`)) {
      try {
        await deleteProject(project.id);
      } catch (err) {
        alert("Failed to delete project: " + err.message);
      }
    }
  };

  const cardImage = project.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800';
  
  // Fake progress calculation for Zeigarnik Effect
  const progress = Math.floor(project.id.length * 3 + 40) % 55 + 40; 
  const milestone = project.stage === 'Idea' ? 'MVP' : project.stage === 'Prototype' ? 'Beta' : 'v2.0';

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group block rounded-2xl p-5 cursor-pointer relative overflow-hidden"
        style={{
          background: '#0D0D0F',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: '1px solid rgba(255,255,255,0.14)',
          transition: 'box-shadow 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
        onHoverStart={e => e.target.style && (e.target.style.boxShadow = '0 0 20px rgba(99,102,241,0.3)')}
        onHoverEnd={e => e.target.style && (e.target.style.boxShadow = 'none')}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <Link to={`/project/${project.id}`} className="relative z-10 flex flex-col h-full">
          
          {/* Top Row: Floating Content Layout (Image + Title) */}
          <div className="flex items-start gap-4 mb-4">
             <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden border border-white/10 relative shadow-md">
               <img 
                 src={cardImage} 
                 alt={project.title} 
                 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                 loading="lazy" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
             </div>
             
             <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h1 className="font-display font-black tracking-[-0.05em] text-white text-[1.15rem] leading-tight line-clamp-2">
                    {project.title}
                  </h1>
                  
                  {/* Actions overlaying top right */}
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     {isOwner && (
                       <button onClick={handleDelete} className="p-1 rounded bg-black/40 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors" title="Delete Project">
                         <X size={14} strokeWidth={1.5} />
                       </button>
                     )}
                     <motion.button 
                       whileTap={{ scale: [0.9, 1.1, 1] }}
                       transition={{ duration: 0.3 }}
                       onClick={handleShare} 
                       className="p-1 rounded bg-black/40 text-slate-400 hover:text-white hover:bg-white/10 transition-colors" title="Share Project">
                       <Share2 size={14} strokeWidth={1.5} />
                     </motion.button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-1.5">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/10 bg-black/20 text-slate-300 text-[9px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-gradient-to-r from-[#6366f1] to-[#a855f7]" />
                    {project.stage}
                  </div>
                  {project.domainTags?.[0] && (
                    <span className="text-[10px] font-medium text-zinc-500 truncate">{project.domainTags[0]}</span>
                  )}
                </div>
             </div>
          </div>

          {/* Description */}
          <p className="text-[0.85rem] text-slate-400 line-clamp-2 mb-5 flex-1">
            {project.shortDescription || project.problemTitle}
          </p>

          {/* Zeigarnik Effect Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-[11px] mb-1.5">
              <span className="data-label text-zinc-500 flex items-center gap-1"><Activity size={12} strokeWidth={1.5}/> {progress}% to {milestone}</span>
              <span className="data-label gradient-text font-semibold">Building</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>

          {/* FOOTER: Metadata */}
          <div className="flex items-center justify-between pt-3 border-t border-white/5 text-zinc-500 text-xs font-medium">
            <div className="flex items-center gap-4">
              <motion.button 
                whileTap={{ scale: [0.9, 1.1, 1] }}
                transition={{ duration: 0.3 }}
                onClick={handleLike} 
                className={`stat-value flex items-center gap-1.5 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-400'}`}
              >
                <Heart size={14} strokeWidth={1.5} className={isLiked ? 'fill-current' : ''} /> {localLikes}
              </motion.button>
              <div className="stat-value flex items-center gap-1.5">
                <Eye size={14} strokeWidth={1.5} /> {project.views}
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.userId)}&background=0F0F11&color=fff`} alt="Creator" className="w-5 h-5 rounded-full border border-white/10" />
            </div>
          </div>
          
        </Link>
      </motion.div>

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={project.title}
        url={`${window.location.origin}/project/${project.id}`}
      />
    </>
  );
}
