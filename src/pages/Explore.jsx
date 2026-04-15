import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProjectCard from '../components/ProjectCard';
import { DOMAINS, TECH_STACKS, STAGES } from '../data/mockData';
import './Explore.css';

export default function Explore() {
  const { projects } = useApp();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedDomains, setSelectedDomains] = useState([]);
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [sort, setSort] = useState('trending');

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const filtered = projects
    .filter(p => {
      if (query) {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.techStack.some(t => t.toLowerCase().includes(q)) ||
          p.domainTags.some(d => d.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .filter(p => !selectedDomains.length || p.domainTags.some(d => selectedDomains.includes(d)))
    .filter(p => !selectedTechs.length || p.techStack.some(t => selectedTechs.includes(t)))
    .filter(p => !selectedStage || p.stage === selectedStage)
    .sort((a, b) => {
      if (sort === 'trending') return b.views - a.views;
      if (sort === 'likes') return b.likes - a.likes;
      if (sort === 'collab') return b.collaborationRequests - a.collaborationRequests;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="page-content main-content">
      <div className="explore-hero" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.8rem' }}>Explore</h1>
        <p style={{ fontSize: '0.9rem' }}>Find builders, projects, and ideas.</p>
        <div className="explore-search mt-4">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search communities..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <div className="home-layout">
        {/* Results Stream (Center) */}
        <div className="explore-results home-feed" style={{ paddingTop: '16px' }}>
          <div className="er-header" style={{ padding: '0 20px' }}>
            <p className="er-count">{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</p>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <Search size={48} />
              <p>No results found. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="project-grid" style={{ padding: '0 20px' }}>
              {filtered.map((p, i) => (
                <div key={p.id} style={{ animationDelay: `${i * 50}ms` }}>
                  <ProjectCard project={p} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar Filters */}
        <aside className="explore-filters home-right-sidebar">
          <div className="sidebar-card">
            <div className="ef-header" style={{ paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
              <SlidersHorizontal size={16} />
              <span>Filters</span>
            </div>

            <div className="ef-section mt-3">
              <p className="ef-label">Sort By</p>
              {[['trending','Most Viewed'],['likes','Most Liked'],['collab','Most Requested'],['newest','Newest']].map(([k,l]) => (
                <button key={k} className={`ef-option ${sort === k ? 'active' : ''}`} onClick={() => setSort(k)}>{l}</button>
              ))}
            </div>

            <div className="ef-section mt-3">
              <p className="ef-label">Stage</p>
              <div className="ef-chips">
                {STAGES.map(s => (
                  <button
                    key={s}
                    className={`chip ${selectedStage === s ? 'chip-active' : 'chip-tech'}`}
                    onClick={() => setSelectedStage(selectedStage === s ? '' : s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="ef-section mt-3">
              <p className="ef-label">Domain</p>
              <div className="ef-chips">
                {DOMAINS.map(d => (
                  <button
                    key={d}
                    className={`chip ${selectedDomains.includes(d) ? 'chip-active' : 'chip-domain'}`}
                    onClick={() => toggleArr(selectedDomains, setSelectedDomains, d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="ef-section mt-3">
              <p className="ef-label">Tech Stack</p>
              <div className="ef-chips">
                {TECH_STACKS.map(t => (
                  <button
                    key={t}
                    className={`chip ${selectedTechs.includes(t) ? 'chip-active' : 'chip-tech'}`}
                    onClick={() => toggleArr(selectedTechs, setSelectedTechs, t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
