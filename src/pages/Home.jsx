import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Rocket, Users, MessageSquare, ArrowRight, Sparkles, Flame, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';

const DOMAIN_OPTIONS = ['All', 'AI', 'IoT', 'Agriculture', 'Health', 'Robotics'];

// Fix #9: Spring Physics — ALL entrance animations
const SPRING = { type: 'spring', stiffness: 300, damping: 20 };

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: SPRING }
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
    // Fix #8: Breathable layout — space-y-16 (was 12), pb-32 (was 24)
    <div className="flex flex-col space-y-16 pb-32">

      {/* Top Bar — Fix #2: Glass search, Fix #8: breathing */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative w-full md:w-[420px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} strokeWidth={1.5} />
          <input
            type="text"
            className="w-full text-slate-300 focus:outline-none transition-all placeholder:text-zinc-600"
            style={{
              background: 'rgba(13,13,15,0.72)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTopColor: 'rgba(255,255,255,0.14)',
              borderRadius: 'var(--radius-input, 8px)',
              padding: '12px 16px 12px 44px',
            }}
            onFocus={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.15)'}
            onBlur={e => e.currentTarget.style.boxShadow = 'none'}
            placeholder="Search problems, projects, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Fix #5/#10: Domain filter pills use ghost-tag style, active = subtle white fill */}
        <div className="flex items-center overflow-x-auto no-scrollbar w-full md:w-auto gap-2">
          {DOMAIN_OPTIONS.map(domain => (
            <motion.button
              key={domain}
              whileTap={{ scale: 0.94 }}
              transition={SPRING}
              className={`px-4 py-1.5 text-xs font-semibold whitespace-nowrap uppercase tracking-wide transition-all ${
                activeDomain === domain
                  ? 'text-white'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              style={{
                borderRadius: 'var(--radius-btn, 8px)',
                border: activeDomain === domain
                  ? '1px solid rgba(99,102,241,0.4)'
                  : '1px solid rgba(255,255,255,0.07)',
                background: activeDomain === domain
                  ? 'rgba(99,102,241,0.1)'
                  : 'transparent',
              }}
              onClick={() => setActiveDomain(domain)}
            >
              {domain}
            </motion.button>
          ))}
        </div>
      </header>

      <motion.section variants={containerVariants} initial="hidden" animate="show" className="space-y-10">
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <h2 className="font-black tracking-[-0.05em] text-white text-2xl flex items-center gap-3">
            <Sparkles size={22} className="text-[#a855f7]" strokeWidth={1.5} /> 
            {user ? 'Recommended for You' : 'Featured Projects'}
          </h2>
          <Link to="/explore" className="text-sm font-normal text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
            View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {personalizedFeed.recommended.map(p => (
            <motion.div key={p.id} variants={itemVariants}><ProjectCard project={p} /></motion.div>
          ))}
          {personalizedFeed.recommended.length === 0 && (
            <div className="col-span-full py-16 text-center text-zinc-600">No specific recommendations yet.</div>
          )}
        </div>
      </motion.section>

      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="space-y-10">
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <h2 className="font-black tracking-[-0.05em] text-white text-2xl flex items-center gap-3">
            <Flame size={22} className="text-[#6366f1]" strokeWidth={1.5} /> 
            Trending in {activeDomain === 'All' ? 'Your Network' : activeDomain}
          </h2>
          <Link to="/explore" className="text-sm font-normal text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
            See trends <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {personalizedFeed.trending.map(p => (
            <motion.div key={p.id} variants={itemVariants}><ProjectCard project={p} /></motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} className="space-y-10">
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <h2 className="font-black tracking-[-0.05em] text-white text-2xl flex items-center gap-3">
            <Compass size={22} className="text-[#a855f7]" strokeWidth={1.5} /> 
            Explore New Domains
          </h2>
          <Link to="/explore" className="text-sm font-normal text-zinc-500 hover:text-white transition-colors flex items-center gap-1 group">
            Discover <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {personalizedFeed.explore.map(p => (
            <motion.div key={p.id} variants={itemVariants}><ProjectCard project={p} /></motion.div>
          ))}
        </div>
      </motion.section>

      {/* Fix #10: FAB uses btn-primary (neon gradient CTA ONLY) */}
      <div className="fixed bottom-8 right-8 z-50 lg:hidden">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="btn-primary w-14 h-14 rounded-full flex items-center justify-center text-white"
          onClick={() => navigate('/upload')}
        >
          <Plus size={24} strokeWidth={2} />
        </motion.button>
      </div>
    </div>
  );
}
