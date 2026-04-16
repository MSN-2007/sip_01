import React, { useState } from 'react';
import { X, Plus, Trash2, ShieldCheck, Lock, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './CreateCommunityModal.css';

export default function CreateCommunityModal({ isOpen, onClose }) {
  const { addCommunity, users, user: currentUser } = useApp();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('Technology');
  const [isPrivate, setIsPrivate] = useState(false);
  
  // Custom Lists
  const [rules, setRules] = useState(['Be respectful', 'No spam']);
  const [newRule, setNewRule] = useState('');
  
  const [sections, setSections] = useState(['General Discussion', 'Announcements', 'Help & Q&A']);
  const [newSection, setNewSection] = useState('');

  // Roles assignment
  const [coordinatorId, setCoordinatorId] = useState('');

  if (!isOpen) return null;

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, newRule.trim()]);
      setNewRule('');
    }
  };

  const handleAddSection = () => {
    if (newSection.trim()) {
      setSections([...sections, newSection.trim()]);
      setNewSection('');
    }
  };

  const handleCreate = () => {
    if (!name.trim() || !description.trim()) {
      alert("Name and description are required.");
      return;
    }

    const newCommunity = {
      id: `c_${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      domain: domain,
      members: 1, // Only the creator
      posts: 0,
      icon: domain.substring(0, 2).toUpperCase(),
      isPremium: false,
      tags: [domain],
      isPrivate: isPrivate,
      rules: rules,
      discussionSections: sections,
      roles: {
        admin: currentUser.id,
        coordinators: coordinatorId ? [coordinatorId] : []
      }
    };

    addCommunity(newCommunity);
    onClose();
  };

  return (
    <div className="ccm-overlay" onClick={onClose}>
      <div className="ccm-modal" onClick={e => e.stopPropagation()}>
        <div className="ccm-header">
          <h2>Create a New Community</h2>
          <button className="ccm-close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="ccm-body">
          {/* Basic Info */}
          <div className="ccm-section">
            <label className="ccm-section-title">Community Name</label>
            <input 
              className="ccm-input" 
              placeholder="e.g. Clean Energy Builders" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
          </div>

          <div className="ccm-section">
            <label className="ccm-section-title">Description</label>
            <textarea 
              className="ccm-textarea" 
              placeholder="What is this community about?" 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
            />
          </div>

          <div className="ccm-section">
            <label className="ccm-section-title">Domain / Category</label>
            <select className="ccm-select" value={domain} onChange={e => setDomain(e.target.value)}>
              <option>Agriculture</option>
              <option>Hardware</option>
              <option>AI/ML</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Software</option>
              <option>Social Impact</option>
              <option>Technology</option>
            </select>
          </div>

          {/* Visibility */}
          <div className="ccm-toggle-row">
            <div className="ccm-toggle-info">
              <span className="ccm-toggle-title">Privacy Setting</span>
              <span className="ccm-section-desc">Public communities are visible to everyone.</span>
            </div>
            <button 
              className={`btn btn-sm ${isPrivate ? 'btn-secondary' : 'btn-primary'}`} 
              onClick={() => setIsPrivate(!isPrivate)}
            >
              {isPrivate ? <><Lock size={16} style={{marginRight: 6}}/> Private</> : <><Globe size={16} style={{marginRight: 6}}/> Public</>}
            </button>
          </div>

          {/* Roles */}
          <div className="ccm-section">
            <label className="ccm-section-title"><ShieldCheck size={16} style={{display:'inline', marginBottom:-3, marginRight:6}}/> Assign Roles</label>
            <p className="ccm-section-desc">You are automatically the Admin. Nominate a Coordinator (optional).</p>
            <select className="ccm-select" value={coordinatorId} onChange={e => setCoordinatorId(e.target.value)}>
              <option value="">-- Select a User --</option>
              {users.filter(u => u.id !== currentUser?.id).map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.tagline})</option>
              ))}
            </select>
          </div>

          {/* Rules */}
          <div className="ccm-section form-group">
            <label className="ccm-section-title">Rules</label>
            <div className="ccm-list-builder">
              <input 
                className="ccm-input" 
                placeholder="Add a rule..." 
                value={newRule} 
                onChange={e => setNewRule(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddRule()}
              />
              <button className="btn btn-secondary" onClick={handleAddRule}><Plus size={18}/></button>
            </div>
            <div className="ccm-list-items">
              {rules.map((r, i) => (
                <div key={i} className="ccm-list-item">
                  <span>{i+1}. {r}</span>
                  <button className="ccm-remove-btn" onClick={() => setRules(rules.filter((_, idx) => idx !== i))}><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion Sections */}
          <div className="ccm-section form-group">
            <label className="ccm-section-title">Discussion Sections</label>
            <p className="ccm-section-desc">Channels where like-minded people will discuss.</p>
            <div className="ccm-list-builder">
              <input 
                className="ccm-input" 
                placeholder="e.g. Project Showcase" 
                value={newSection} 
                onChange={e => setNewSection(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSection()}
              />
              <button className="btn btn-secondary" onClick={handleAddSection}><Plus size={18}/></button>
            </div>
            <div className="ccm-list-items">
              {sections.map((s, i) => (
                <div key={i} className="ccm-list-item">
                  <span># {s}</span>
                  <button className="ccm-remove-btn" onClick={() => setSections(sections.filter((_, idx) => idx !== i))}><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
          </div>

        </div>
        
        <div className="ccm-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleCreate}>Create Community</button>
        </div>
      </div>
    </div>
  );
}
