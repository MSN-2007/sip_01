import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Rocket, Users, MessageSquare, ArrowRight, Sparkles, Flame, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';

const DOMAIN_OPTIONS = ['All', 'AI', 'IoT', 'Agriculture', 'Health', 'Robotics'];

// Obsidian & Neon Spring Physics
const SNAPPY_SPRING = { type: 'spring', stiffness: 400, damping: 30 };

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: SNAPPY_SPRING }
};

export default function Home() {
  const { projects, user } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');

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
    <div className="flex flex-col space-y-24 pb-32">
      {/* Top Bar — Cinematic Search & Filters */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="relative w-full md:w-[460px]">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} strokeWidth={1.5} />
          <input
            type="text"
            className="w-full bg-[#0A0A0B]/60 backdrop-blur-xl border border-white/5 rounded-lg py-4 pl-14 pr-6 text-zinc-200 focus:outline-none focus:border-violet-500/30 transition-all placeholder:text-zinc-600 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
            placeholder="Search projects or creators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center overflow-x-auto no-scrollbar w-full md:w-auto gap-3">
          {DOMAIN_OPTIONS.map(domain => (
            <motion.button
              key={domain}
              whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] rounded-full transition-all border ${
                activeDomain === domain
                  ? 'bg-violet-500/10 border-violet-500/40 text-violet-400'
                  : 'bg-transparent border-white/5 text-zinc-500 hover:border-white/10 hover:text-zinc-300'
              }`}
              onClick={() => setActiveDomain(domain)}
            >
              {domain}
            </motion.button>
          ))}
        </div>
      </header>

      {/* Recommended Section */}
      <motion.section variants={containerVariants} initial="hidden" animate="show" className="space-y-12">
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <div>
            <h2 className="heading-gradient text-3xl font-black tracking-[-0.07em] mb-2">
              {user ? 'Selected for You' : 'Featured Showcase'}
            </h2>
            <p className="text-zinc-500 text-sm font-normal">Hand-picked innovations matching your profile.</p>
          </div>
          <Link to="/explore" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-violet-400 transition-colors flex items-center gap-2 group">
            Explore All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {personalizedFeed.recommended.map(p => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
          {personalizedFeed.recommended.length === 0 && (
            <div className="col-span-full py-20 text-center text-zinc-700 font-medium uppercase tracking-[0.2em] text-xs">
               Project repository empty.
            </div>
          )}
        </div>
      </motion.section>

      {/* Trending Section */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="space-y-12">
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <div>
            <h2 className="heading-gradient text-3xl font-black tracking-[-0.07em] mb-2">
              Market Velocity
            </h2>
            <p className="text-zinc-500 text-sm font-normal">Projects gaining significant traction this week.</p>
          </div>
          <Link to="/explore" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-violet-400 transition-colors flex items-center gap-2 group">
            Velocity Index <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {personalizedFeed.trending.map(p => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Explore Section */}
      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="space-y-12">
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <div>
            <h2 className="heading-gradient text-3xl font-black tracking-[-0.07em] mb-2">
              Discover Domains
            </h2>
            <p className="text-zinc-500 text-sm font-normal">Broaden your perspective across emerging tech.</p>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {personalizedFeed.explore.map(p => (
            <motion.div key={p.id} variants={itemVariants}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Glow FAB (Mobile Only) */}
      <div className="fixed bottom-10 right-10 z-50 lg:hidden">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={SNAPPY_SPRING}
          className="glow-button w-16 h-16 rounded-full flex items-center justify-center shadow-2xl"
          onClick={() => navigate('/upload')}
        >
          <Plus size={28} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}
