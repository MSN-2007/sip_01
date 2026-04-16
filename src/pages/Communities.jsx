import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateCommunityModal from '../components/CreateCommunityModal';
import { 
  Users, 
  Search, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  Lock 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Communities.css';

const CATEGORIES = ['All', 'Agriculture', 'Hardware', 'AI/ML', 'Healthcare', 'Education', 'Software', 'Social Impact'];

export default function Communities() {
  const { communities, joinedCommunities, toggleJoinCommunity, user } = useApp();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateCommunityClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      setIsModalOpen(true);
    }
  };

  const filtered = useMemo(() => {
    let result = communities.filter(c => !joinedCommunities.includes(c.id));
    if (activeCategory !== 'All') {
      result = result.filter(c => c.domain === activeCategory || c.tags.includes(activeCategory));
    }
    if (searchQuery) {
      result = result.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [communities, joinedCommunities, activeCategory, searchQuery]);

  const joined = useMemo(() => {
    return communities.filter(c => joinedCommunities.includes(c.id));
  }, [communities, joinedCommunities]);

  return (
    <div className="communities-page-new">
      
      {/* Header */}
      <header className="communities-header-new">
        <h1 className="communities-title-new">Communities</h1>
        <p className="communities-subtitle-new">Scale your impact. Join domain-specific builder groups.</p>
        
        <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
           <div className="search-container-new" style={{ maxWidth: 600, flex: 1 }}>
              <Search className="search-icon-new" size={20} />
              <input 
                className="search-input-new" 
                placeholder="Search domain experts, builders, or guilds..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
           </div>
           <button 
             className="btn btn-primary" 
             style={{ padding: '0 24px' }}
             onClick={handleCreateCommunityClick}
           >
             Create Community
           </button>
        </div>
      </header>

      {/* Categories */}
      <div className="community-categories-new">
         {CATEGORIES.map(cat => (
           <button 
             key={cat} 
             className={`domain-pill ${activeCategory === cat ? 'active' : ''}`}
             onClick={() => setActiveCategory(cat)}
           >
             {cat}
           </button>
         ))}
      </div>

      {/* Sections */}
      {joined.length > 0 && (
        <section className="community-section-new">
           <div className="section-header-row">
              <h2 className="section-title-new"><ShieldCheck size={20} style={{ color: 'var(--accent-primary)' }} /> Your Communities</h2>
           </div>
           <div className="community-grid-new">
              {joined.map(c => <CommunityCard key={c.id} community={c} joined={true} onToggle={() => toggleJoinCommunity(c.id)} />)}
           </div>
        </section>
      )}

      <section className="community-section-new">
         <div className="section-header-row">
            <h2 className="section-title-new">
              <TrendingUp size={20} style={{ color: '#fbbf24' }} /> 
              {activeCategory === 'All' ? 'Discover New Domains' : `Discover in ${activeCategory}`}
            </h2>
            <a href="/explore" className="section-view-all">View Trends <ArrowRight size={16} /></a>
         </div>
         <div className="community-grid-new">
            {filtered.map(c => <CommunityCard key={c.id} community={c} joined={false} onToggle={() => toggleJoinCommunity(c.id)} />)}
         </div>
      </section>

      <CreateCommunityModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function CommunityCard({ community, joined, onToggle }) {
  return (
    <div className={`community-card-new glass-card ${community.isPremium ? 'premium-community' : ''}`}>
      {community.isPremium && <div className="c-premium-badge">Premium</div>}
      
      <div className="c-card-header">
         <div className="c-icon-box">{community.icon}</div>
         <div className="c-info-box">
            <p className="c-domain-new">{community.domain}</p>
            <h4 className="c-name-new">{community.name}</h4>
         </div>
      </div>

      <p className="c-desc-new">{community.description}</p>

      <div className="c-footer-new">
         <div className="c-members-new">
            <Users size={14} />
            {community.members.toLocaleString()} members
         </div>
         {community.isPremium ? (
           <button className="btn btn-primary btn-sm" style={{ padding: '6px 14px' }}>
             <Lock size={14} /> Unlock
           </button>
         ) : (
           <button 
             className={`btn btn-sm ${joined ? 'btn-ghost' : 'btn-primary'}`}
             onClick={onToggle}
             style={{ padding: '6px 14px', minWidth: 80 }}
           >
             {joined ? 'Joined ✓' : 'Join'}
           </button>
         )}
      </div>
    </div>
  );
}
