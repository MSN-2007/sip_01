import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { DOMAINS, TECH_STACKS, SDG_GOALS, STAGES } from '../data/mockData';
import './FilterBar.css';

export default function FilterBar({ filters, onChange }) {
  const [open, setOpen] = useState(null);

  const toggle = (key) => setOpen(open === key ? null : key);

  const setFilter = (key, value) => {
    const prev = filters[key] || [];
    const next = prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];
    onChange({ ...filters, [key]: next });
  };

  const clearAll = () => onChange({ domain: [], tech: [], sdg: [], stage: [] });

  const activeCount = Object.values(filters).flat().length;

  const menus = [
    { key: 'domain', label: 'Domain', options: DOMAINS },
    { key: 'tech', label: 'Tech Stack', options: TECH_STACKS },
    { key: 'sdg', label: 'SDG', options: SDG_GOALS.map(g => `SDG ${g.id}: ${g.label}`) },
    { key: 'stage', label: 'Stage', options: STAGES },
  ];

  return (
    <div className="filter-bar">
      <div className="filter-bar-inner">
        <div className="filter-icon-label">
          <Filter size={16} />
          <span>Filters</span>
          {activeCount > 0 && <span className="filter-count">{activeCount}</span>}
        </div>

        <div className="filter-menus">
          {menus.map(({ key, label, options }) => {
            const selected = filters[key] || [];
            return (
              <div key={key} className="filter-dropdown">
                <button
                  className={`filter-btn ${selected.length > 0 ? 'active' : ''}`}
                  onClick={() => toggle(key)}
                >
                  {label}
                  {selected.length > 0 && <span className="filter-sel-count">{selected.length}</span>}
                  <ChevronDown size={14} className={`fd-chevron ${open === key ? 'open' : ''}`} />
                </button>
                {open === key && (
                  <div className="fd-menu">
                    {options.map(opt => {
                      // For SDG options, extract the raw key
                      const rawVal = key === 'sdg' ? opt : opt;
                      const isChecked = selected.includes(rawVal);
                      return (
                        <button
                          key={opt}
                          className={`fd-option ${isChecked ? 'selected' : ''}`}
                          onClick={() => setFilter(key, rawVal)}
                        >
                          <span className="fd-checkbox">{isChecked ? '✓' : ''}</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {activeCount > 0 && (
          <button className="filter-clear" onClick={clearAll}>Clear all</button>
        )}
      </div>
    </div>
  );
}
