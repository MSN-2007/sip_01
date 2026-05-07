import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Share2, X, Eye, Activity } from 'lucide-react';
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
      <Link 
        to={`/project/${project.id}`} 
        className="group flex flex-col bg-[#161618] rounded-[12px] border border-white/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:border-violet-500/30"
      >
        
        {/* TOP: Image & Actions */}
        <div className="relative h-40 w-full overflow-hidden">
           <img 
             src={cardImage} 
             alt={project.title} 
             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
             loading="lazy" 
           />
           {/* Gradient Overlay */}
           <div className="absolute inset-0 bg-gradient-to-t from-[#161618] via-transparent to-black/30" />
           
           {/* Actions overlaying top right */}
           <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {isOwner && (
                <button onClick={handleDelete} className="p-1.5 rounded-md bg-black/50 backdrop-blur text-slate-300 hover:text-rose-500 hover:bg-rose-500/20 transition-colors" title="Delete Project">
                  <X size={16} />
                </button>
              )}
              <button onClick={handleShare} className="p-1.5 rounded-md bg-black/50 backdrop-blur text-slate-300 hover:text-white hover:bg-white/10 transition-colors" title="Share Project">
                <Share2 size={16} />
              </button>
           </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 flex flex-col flex-1">
           {/* Ghost Tag */}
           <div className="flex items-center justify-between mb-3">
             <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-slate-700 bg-black/20 text-slate-300 text-[10px] font-bold uppercase tracking-wider">
               <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-violet-500" />
               {project.stage}
             </div>
             
             {project.domainTags?.[0] && (
               <span className="text-xs font-medium text-slate-500 truncate max-w-[120px]">{project.domainTags[0]}</span>
             )}
           </div>

           {/* Title as H1 */}
           <h1 className="font-display font-semibold tracking-[-0.02em] text-white text-lg leading-tight mb-2 line-clamp-2">
             {project.title}
           </h1>
           
           <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
             {project.shortDescription || project.problemTitle}
           </p>

           {/* Zeigarnik Effect Progress Bar */}
           <div className="mb-4">
             <div className="flex justify-between text-xs mb-1.5">
               <span className="text-slate-400 flex items-center gap-1"><Activity size={12}/> {progress}% to {milestone}</span>
               <span className="text-violet-400 font-medium">Active</span>
             </div>
             <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
               <div className="h-full bg-gradient-to-r from-violet-600 to-fuchsia-500 rounded-full" style={{ width: `${progress}%` }} />
             </div>
           </div>

           {/* FOOTER: Metadata */}
           <div className="flex items-center justify-between pt-3 border-t border-white/5 text-slate-500 text-xs font-medium">
             <div className="flex items-center gap-3">
               <button 
                 onClick={handleLike} 
                 className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-400'}`}
               >
                 <Heart size={14} className={isLiked ? 'fill-current' : ''} /> {localLikes}
               </button>
               <div className="flex items-center gap-1.5">
                 <Eye size={14} /> {project.views}
               </div>
             </div>
             
             {/* Author Avatar (Placeholder since no author data in basic list) */}
             <div className="flex items-center gap-1.5">
               <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.userId)}&background=2dd4bf&color=fff`} alt="Creator" className="w-5 h-5 rounded-full border border-white/10" />
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
