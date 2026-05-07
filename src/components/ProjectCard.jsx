import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, X, Eye, Activity, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ShareModal from './ShareModal';

// Fix #9: Spring Physics — uniform spring config for ALL hover & entrance states
const SPRING = { type: 'spring', stiffness: 300, damping: 20 };

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
  // Zeigarnik Effect
  const progress = Math.floor(project.id.length * 3 + 40) % 55 + 40;
  const milestone = project.stage === 'Idea' ? 'MVP' : project.stage === 'Prototype' ? 'Beta' : 'v2.0';

  // Fix #7: Stage determines ghost tag color variant
  const stageTagClass = project.stage === 'Production' ? 'ghost-tag-green' : 'ghost-tag';

  return (
    <>
      <motion.div
        // Fix #9: Spring Physics
        whileHover={{ scale: 1.025, y: -4, boxShadow: '0 0 28px rgba(99,102,241,0.3), 0 24px 48px rgba(0,0,0,0.6)' }}
        transition={SPRING}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        // Fix #3: Nested Radii — cards use 16px (--radius-card)
        // Fix #6: Multi-layer shadow baked in
        className="group block cursor-pointer relative overflow-hidden"
        style={{
          borderRadius: 'var(--radius-card, 16px)',
          background: '#0D0D0F',
          border: '1px solid rgba(255,255,255,0.08)',
          borderTop: '1px solid rgba(255,255,255,0.14)',
          // Fix #6: Three-layer shadow
          boxShadow: '0 4px 6px rgba(0,0,0,0.5), 0 12px 28px rgba(0,0,0,0.5), 0 32px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Hover ambient glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/5 to-[#a855f7]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Fix #8: Breathable Layout — padding increased 50% (from p-5 to p-7) */}
        <Link to={`/project/${project.id}`} className="relative z-10 flex flex-col h-full p-7">

          {/* TOP ROW: Image + Title — "Floating Content" layout */}
          <div className="flex items-start gap-5 mb-6">
            <div className="w-[68px] h-[68px] shrink-0 overflow-hidden border border-white/10 relative shadow-md" style={{ borderRadius: 'var(--radius-btn, 8px)' }}>
              <img src={cardImage} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                {/* Fix #4: Heading = white 900, no compromise */}
                <h1 className="font-black tracking-[-0.05em] text-white text-[1.1rem] leading-tight line-clamp-2">
                  {project.title}
                </h1>

                {/* Actions — reveal on hover */}
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {isOwner && (
                    <button onClick={handleDelete} className="p-1.5 rounded-[6px] bg-black/40 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 transition-colors">
                      <X size={13} strokeWidth={1.5} />
                    </button>
                  )}
                  <motion.button whileTap={{ scale: 0.88 }} transition={SPRING} onClick={handleShare} className="p-1.5 rounded-[6px] bg-black/40 text-zinc-500 hover:text-white hover:bg-white/10 transition-colors">
                    <Share2 size={13} strokeWidth={1.5} />
                  </motion.button>
                </div>
              </div>

              {/* Fix #5: Ghost Tags — 1px border + 5% fill */}
              <div className="flex items-center gap-2 mt-2">
                <span className={stageTagClass}>{project.stage}</span>
                {project.domainTags?.[0] && (
                  <span className="ghost-tag">{project.domainTags[0]}</span>
                )}
              </div>
            </div>
          </div>

          {/* Fix #4: Description — zinc-500, weight 400, NEVER same as heading */}
          <p className="text-[0.84rem] text-zinc-500 font-normal line-clamp-2 mb-6 flex-1">
            {project.shortDescription || project.problemTitle}
          </p>

          {/* Zeigarnik Effect Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-[11px] mb-2">
              <span className="data-label text-zinc-500 flex items-center gap-1.5">
                <Activity size={11} strokeWidth={1.5}/> {progress}% to {milestone}
              </span>
              <span className="data-label gradient-text font-semibold">Building</span>
            </div>
            <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'linear-gradient(135deg,#6366f1,#a855f7)' }} />
            </div>
          </div>

          {/* FOOTER: Always-visible stats + Progressive Disclosure */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 text-zinc-500 text-xs">
            <div className="flex items-center gap-4">
              {/* Like — always visible */}
              <motion.button
                whileTap={{ scale: 0.88 }}
                transition={SPRING}
                onClick={handleLike}
                className={`stat-value flex items-center gap-1.5 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-400'}`}
              >
                <Heart size={13} strokeWidth={1.5} className={isLiked ? 'fill-current' : ''} /> {localLikes}
              </motion.button>

              {/* Fix #7: Progressive Disclosure — Views hidden by default, revealed on hover */}
              <motion.div
                className="stat-value flex items-center gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={SPRING}
              >
                <Eye size={13} strokeWidth={1.5} /> {project.views ?? '—'}
              </motion.div>

              {/* Fix #7: Date hidden by default, smooth reveal on hover */}
              <motion.div
                className="data-label flex items-center gap-1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ ...SPRING, delay: 0.04 }}
              >
                <Calendar size={11} strokeWidth={1.5} />
                {project.createdAt ? new Date(project.createdAt?.seconds ? project.createdAt.seconds * 1000 : project.createdAt).toLocaleDateString('en', { month: 'short', year: '2-digit' }) : '—'}
              </motion.div>
            </div>

            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.userId)}&background=0D0D0F&color=fff&size=40`}
              alt="Creator"
              className="w-[22px] h-[22px] rounded-full border border-white/10"
            />
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
