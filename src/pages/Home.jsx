import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Rocket, Users, MessageSquare, ArrowRight, Sparkles, Flame, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';

const DOMAIN_OPTIONS = ['All', 'AI', 'IoT', 'Agriculture', 'Health', 'Robotics'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function Home() {
  const { projects, user } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');
  const [isFabOpen, setIsFabOpen] = useState(false);

  const personalizedFeed = useMemo(() => {
    let base = [...(projects || [])];
    if (searchQuery) {
      base = base.filter(p => 
        p.title?.toLowerCase()?.includes(searchQuery.toLowerCase()) || 
        p.problemTitle?.toLowerCase()?.includes(searchQuery.toLowerCase())
      );
    }
    if (activeDomain !== 'All') {
      base = base.filter(p => p.domainTags?.some(d => d.includes(activeDomain)));
    }

    let recommended = [];
    if (user?.tagline) {
      recommended = base.filter(p => 
        p.domainTags?.some(d => typeof user.tagline === 'string' && typeof d === 'string' && user.tagline.includes(d)) || 
        p.techStack?.some(t => typeof user.tagline === 'string' && typeof t === 'string' && user.tagline.includes(t))
      ).slice(0, 3);
    }

    if (recommended.length === 0) {
      recommended = base.filter(p => p.featured).slice(0, 3);
      if (recommended.length === 0) recommended = base.slice(0, 3);
    }

    const trending = base
      .filter(p => p.views > 1000 || p.likes > 100)
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, 3);

    const explore = base.filter(p => !recommended.includes(p) && !trending.includes(p));

    return { recommended, trending, explore };
  }, [projects, searchQuery, activeDomain, user?.tagline]);

  return (
    <div className="flex flex-col space-y-12 pb-24">
      {/* Top Bar */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} strokeWidth={1.5} />
          <input 
            type="text" 
            className="w-full bg-[#0F0F11] border border-white/5 rounded-2xl py-3 pl-11 pr-4 text-slate-300 focus:outline-none focus:border-[#6366f1]/50 focus:shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all placeholder:text-zinc-600" 
            placeholder="Search problems, projects, or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center overflow-x-auto no-scrollbar w-full md:w-auto gap-2 pb-2 md:pb-0">
          {DOMAIN_OPTIONS.map(domain => (
            <button 
              key={domain} 
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 border ${
                activeDomain === domain 
                  ? 'bg-white/10 text-white border-white/20' 
                  : 'bg-transparent text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
              }`}
              onClick={() => setActiveDomain(domain)}
            >
              {domain}
            </button>
          ))}
        </div>
      </header>

      {/* Recommended Section */}
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <h2 className="font-display font-black tracking-[-0.05em] text-white text-2xl flex items-center gap-2">
            <Sparkles size={24} className="text-[#a855f7]" strokeWidth={1.5} /> 
            {user ? 'Recommended for You' : 'Featured Projects'}
          </h2>
          <Link to="/explore" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
            View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {personalizedFeed.recommended.map(p => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
          {personalizedFeed.recommended.length === 0 && (
            <div className="col-span-full py-12 text-center text-zinc-600">
               No specific recommendations yet. Explore more to improve this!
            </div>
          )}
        </div>
      </motion.section>

      {/* Trending Section */}
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <h2 className="font-display font-black tracking-[-0.05em] text-white text-2xl flex items-center gap-2">
            <Flame size={24} className="text-[#6366f1]" strokeWidth={1.5} /> 
            Trending in {activeDomain === 'All' ? 'Your Network' : activeDomain}
          </h2>
          <Link to="/explore" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
            See trends <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {personalizedFeed.trending.map(p => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Explore Section */}
      <motion.section 
        variants={containerVariants} 
        initial="hidden" 
        whileInView="show" 
        viewport={{ once: true, margin: "-100px" }}
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <h2 className="font-display font-black tracking-[-0.05em] text-white text-2xl flex items-center gap-2">
            <Compass size={24} className="text-[#a855f7]" strokeWidth={1.5} /> 
            Explore New Domains
          </h2>
          <Link to="/explore" className="text-sm font-medium text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
            Discover <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {personalizedFeed.explore.map(p => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 z-50 lg:hidden">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]"
          onClick={() => navigate('/upload')}
        >
          <Plus size={24} strokeWidth={2} />
        </motion.button>
      </div>
    </div>
  );
}
