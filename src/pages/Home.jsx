import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Rocket, Users, MessageSquare, ArrowRight, Sparkles, Flame, Compass } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';
import './Home.css';

const DOMAIN_OPTIONS = ['All', 'AI', 'IoT', 'Agriculture', 'Health', 'Robotics'];

export default function Home() {
  const { projects, user } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('All');
  const [isFabOpen, setIsFabOpen] = useState(false);

  const personalizedFeed = useMemo(() => {
    let base = [...(projects || [])];
    if (searchQuery) {
      base = base.filter(p => 
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.problemTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (activeDomain !== 'All') {
      base = base.filter(p => p.domainTags?.some(d => d.includes(activeDomain)));
    }

    // Recommendation logic: Simple match on user's skills/domain
    let recommended = [];
    if (user?.tagline) {
      recommended = base.filter(p => 
        p.domainTags?.some(d => user.tagline.includes(d)) || 
        p.techStack?.some(t => user.tagline.includes(t))
      ).slice(0, 3);
    }

    // Fallback if no specific recommendations or not logged in
    if (recommended.length === 0) {
      recommended = base.filter(p => p.featured).slice(0, 3);
      if (recommended.length === 0) recommended = base.slice(0, 3);
    }

    const trending = base
      .filter(p => p.views > 1000 || p.likes > 100)
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, 3);

    const explore = base.filter(p => !recommended.includes(p) && !trending.includes(p)).slice(0, 4);

    return { recommended, trending, explore };
  }, [projects, searchQuery, activeDomain, user?.tagline]);

  return (
    <div className="home-page-new">
      {/* Top Bar */}
      <header className="home-top-bar">
        <div className="search-container-new">
          <Search className="search-icon-new" size={20} />
          <input 
            type="text" 
            className="search-input-new" 
            placeholder="Search problems, projects, or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="domain-filters-new">
          {DOMAIN_OPTIONS.map(domain => (
            <button 
              key={domain} 
              className={`domain-pill ${activeDomain === domain ? 'active' : ''}`}
              onClick={() => setActiveDomain(domain)}
            >
              {domain}
            </button>
          ))}
        </div>
      </header>

      {/* Recommended Section */}
      <section className="feed-section">
        <div className="section-header-new">
          <h2 className="section-title-new">
            <Sparkles size={24} style={{ color: 'var(--accent-primary)', marginRight: 8 }} /> 
            {user ? 'Recommended for You' : 'Featured Projects'}
          </h2>
          <Link to="/explore" className="section-view-all">View all <ArrowRight size={16} /></Link>
        </div>
        <div className="horizontal-grid">
          {personalizedFeed.recommended.map(p => <ProjectCard key={p.id} project={p} />)}
          {personalizedFeed.recommended.length === 0 && (
            <div className="empty-section-msg">
               <p className="text-muted">No specific recommendations yet. Explore more to improve this!</p>
            </div>
          )}
        </div>
      </section>

      {/* Trending Section */}
      <section className="feed-section">
        <div className="section-header-new">
          <h2 className="section-title-new">
            <Flame size={24} style={{ color: 'var(--accent-orange)', marginRight: 8 }} /> 
            Trending in {activeDomain === 'All' ? 'Your Network' : activeDomain}
          </h2>
          <Link to="/explore" className="section-view-all">See trends <ArrowRight size={16} /></Link>
        </div>
        <div className="horizontal-grid">
          {personalizedFeed.trending.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* Explore Section */}
      <section className="feed-section">
        <div className="section-header-new">
          <h2 className="section-title-new">
            <Compass size={24} style={{ color: 'var(--accent-secondary)', marginRight: 8 }} /> 
            Explore New Domains
          </h2>
          <Link to="/explore" className="section-view-all">Discover <ArrowRight size={16} /></Link>
        </div>
        <div className="horizontal-grid">
          {personalizedFeed.explore.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      </section>

      {/* Floating Action Button */}
      <div className={`fab-container ${isFabOpen ? 'active' : ''}`}>
        <div className="fab-menu">
          <Link to="/upload" className="fab-item">
            <Plus size={18} /> Create Project
          </Link>
          <button className="fab-item" onClick={() => navigate('/communities')}>
            <Users size={18} /> Join Community
          </button>
          <button className="fab-item" onClick={() => navigate('/explore')}>
            <MessageSquare size={18} /> Find Collaborators
          </button>
        </div>
        <button className="fab-main" onClick={() => setIsFabOpen(!isFabOpen)}>
          <Plus size={32} />
        </button>
      </div>
    </div>
  );
}
