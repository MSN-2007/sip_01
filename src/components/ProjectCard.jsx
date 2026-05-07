import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, X, Eye, Activity, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ShareModal from './ShareModal';

// Obsidian & Neon Spring Physics
const SNAPPY_SPRING = { type: 'spring', stiffness: 400, damping: 30 };

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { likedProjects, toggleLike, user, deleteProject } = useApp();
  const isLiked = likedProjects.includes(project.id);
  const isOwner = user && project.userId === user.id;
  const [localLikes, setLocalLikes] = useState(project.likes);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
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
      try { await deleteProject(project.id); }
      catch (err) { alert('Failed to delete: ' + err.message); }
    }
  };

  const cardImage = project.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800';

  return (
    <>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={SNAPPY_SPRING}
        className="glass-card group relative overflow-hidden rounded-xl cursor-pointer"
      >
        {/* Subtle indigo ambient glow on hover */}
        <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <Link to={`/project/${project.id}`} className="relative z-10 block p-6">
          <div className="flex items-start gap-5">
            {/* Image Section */}
            <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-white/5 shadow-2xl">
              <img 
                src={cardImage} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="heading-gradient text-xl font-black tracking-[-0.07em] leading-[1.1] mb-2 line-clamp-2">
                    {project.title}
                  </h1>
                  
                  {/* Neon Pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="neon-pill">{project.stage}</span>
                    {project.domainTags?.[0] && (
                      <span className="neon-pill">{project.domainTags[0]}</span>
                    )}
                  </div>
                </div>

                {/* Actions overlaying top right */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                   {isOwner && (
                     <button onClick={handleDelete} className="p-1.5 rounded-md bg-white/5 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors">
                       <X size={14} />
                     </button>
                   )}
                   <button onClick={handleShare} className="p-1.5 rounded-md bg-white/5 text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">
                     <Share2 size={14} />
                   </button>
                </div>
              </div>

              <p className="text-zinc-400 text-sm font-normal line-clamp-2 leading-relaxed mb-4">
                {project.shortDescription || project.problemTitle}
              </p>
            </div>
          </div>

          {/* Progressive Disclosure Section (Metadata) */}
          <div className="border-t border-white/5 pt-4 mt-2 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Like (Always Visible) */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${isLiked ? 'text-violet-500' : 'text-zinc-500 hover:text-violet-400'}`}
              >
                <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                <span className="mono-data">{localLikes}</span>
              </motion.button>

              {/* Revealable Stats */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={SNAPPY_SPRING}
                    className="flex items-center gap-4 border-l border-white/10 pl-4"
                  >
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                      <Eye size={13} />
                      <span className="mono-data">{project.views ?? 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                      <Calendar size={13} />
                      <span className="mono-data">
                        {project.createdAt ? new Date(project.createdAt?.seconds ? project.createdAt.seconds * 1000 : project.createdAt).toLocaleDateString('en', { month: 'short', year: '2-digit' }) : '—'}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Creator Avatar */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest hidden group-hover:inline">BY</span>
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.userId)}&background=0A0A0B&color=8B5CF6&size=40`} 
                alt="Creator" 
                className="w-5 h-5 rounded-full border border-white/10" 
              />
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
