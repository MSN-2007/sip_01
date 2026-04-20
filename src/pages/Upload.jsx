import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle, 
  Upload as UploadIcon, 
  X, 
  Plus, 
  Info, 
  Layers, 
  Zap, 
  Rocket, 
  Globe, 
  Cpu, 
  Video, 
  Users, 
  Search 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TECH_STACKS, DOMAINS } from '../data/mockData';
import { addProject } from '../services/db';
import './Upload.css';

const STEPS = [
  'Basic Info', 
  'Category', 
  'Stage', 
  'Description', 
  'Tech Stack', 
  'Alt Uses', 
  'Media', 
  'Collaboration', 
  'Review'
];

const defaultForm = {
  title: '',
  problemTitle: '',
  shortDescription: '',
  stage: 'Idea',
  domainTags: [],
  problemExplained: '',
  solutionApproach: '',
  howItWorks: '',
  techStack: [],
  alternativeUses: [''],
  media: [],
  skillsNeeded: [],
  openForCollaboration: true,
};

export default function Upload() {
  const navigate = useNavigate();
  const { addProject: addProjectToCache, user, authLoading } = useApp();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Fallback to prevent crash if unauthenticated
  if (authLoading || !user) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading...</div>;
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const toggleArr = (key, val) => {
    const arr = form[key];
    set(key, arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));

  const canNext = () => {
    if (step === 0) return form.title && form.problemTitle;
    if (step === 1) return form.domainTags.length > 0;
    if (step === 2) return form.stage;
    if (step === 3) return form.problemExplained.length > 20;
    if (step === 4) return form.techStack.length > 0;
    return true;
  };

  const handlePublish = async () => {
    setIsSubmitting(true);
    const newProject = {
      ...form,
      userId: user.id,
      user: { 
        id: user.id, 
        name: user.name, 
        avatar: user.avatar, 
        tagline: user.tagline || 'Builder', 
        location: user.location || 'Global',
        projects: user.projects || 0,
        followers: user.followers || 0,
        sdgScore: user.sdgScore || 0
      },
      createdAt: new Date().toISOString().split('T')[0],
      contributors: 1,
      collaborationCTA: form.stage === 'Production' ? 'Contribute' : 'Build With Me',
      // Schema alignment fixes:
      longDescription: `${form.problemExplained}\n\n${form.solutionApproach}`,
      sdgTags: [], // Not currently in form, but required for detail page
      proofOfWork: {
         images: [],
         videoUrl: form.media[0] || null,
         patentNumber: null
      },
      likes: 0,
      views: 0,
      collaborationRequests: 0
    };
    
    try {
      const savedProject = await addProject(newProject);
      addProjectToCache(savedProject);
      alert("Project Successfully Uploaded! It is now live on the feed.");
      navigate(`/`);
    } catch (e) {
      console.error("Error creating project", e);
      alert(`Failed to save project to cloud. ERROR: ${e.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="upload-page-new">
      <header className="upload-header-new">
        <h1 className="upload-title-new">Create Project</h1>
        <p className="upload-subtitle-new">Define the problem and share your structured progress.</p>
      </header>

      {/* Progress Indicator */}
      <div className="wizard-progress">
        {STEPS.map((s, i) => (
          <div key={s} className={`progress-step ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
             {i < step ? <CheckCircle size={16} /> : (i + 1)}
             <span className="progress-label">{s}</span>
          </div>
        ))}
      </div>

      <div className="wizard-form-card">
        <div className="step-content">
          <h2 className="step-title-new">{STEPS[step]}</h2>

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="fade-in">
              <div className="form-field-group">
                <label className="field-label-new">Project Name</label>
                <input className="field-input-new" placeholder="e.g. SoilSense" value={form.title} onChange={e => set('title', e.target.value)} />
              </div>
              <div className="form-field-group">
                <label className="field-label-new">Problem Tagline <span className="text-muted">(What are you solving?)</span></label>
                <input className="field-input-new" placeholder="e.g. Inaccessible Soil Health Monitoring for Farmers" value={form.problemTitle} onChange={e => set('problemTitle', e.target.value)} />
              </div>
              <div className="form-field-group">
                <label className="field-label-new">Elevator Pitch <span className="text-muted">(Short description)</span></label>
                <textarea className="field-input-new" rows={3} placeholder="1-2 sentences summarizing your solution..." value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 1: Category */}
          {step === 1 && (
            <div className="domain-grid-new fade-in">
              {DOMAINS.map(d => (
                <div 
                  key={d} 
                  className={`domain-option-card ${form.domainTags.includes(d) ? 'selected' : ''}`}
                  onClick={() => toggleArr('domainTags', d)}
                >
                  <Globe size={24} />
                  <span>{d}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Stage */}
          {step === 2 && (
            <div className="stage-select-row fade-in">
              {[
                { id: 'Idea', icon: Layers, desc: 'Planning and conceptual stage' },
                { id: 'Prototype', icon: Zap, desc: 'Working model or MVP' },
                { id: 'Production', icon: Rocket, desc: 'Deployed and active solution' }
              ].map(s => (
                <div 
                  key={s.id} 
                  className={`stage-card-new ${form.stage === s.id ? 'selected' : ''}`}
                  onClick={() => set('stage', s.id)}
                >
                  <s.icon size={32} style={{ marginBottom: 12, color: form.stage === s.id ? '#10b981' : 'var(--text-muted)' }} />
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{s.id}</h4>
                  <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: 8 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Description */}
          {step === 3 && (
            <div className="fade-in">
              <div className="form-field-group">
                 <label className="field-label-new">The Problem</label>
                 <textarea className="field-input-new" rows={4} placeholder="Explain the pain point in detail..." value={form.problemExplained} onChange={e => set('problemExplained', e.target.value)} />
              </div>
              <div className="form-field-group">
                 <label className="field-label-new">Solution Approach</label>
                 <textarea className="field-input-new" rows={4} placeholder="How does your project address this?" value={form.solutionApproach} onChange={e => set('solutionApproach', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 4: Tech Stack */}
          {step === 4 && (
            <div className="fade-in">
               <div className="tag-selector-new" style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {TECH_STACKS.map(t => (
                    <button 
                      key={t} 
                      className={`domain-pill ${form.techStack.includes(t) ? 'active' : ''}`}
                      onClick={() => toggleArr('techStack', t)}
                    >
                      {t}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {/* Step 5: Alt Uses */}
          {step === 5 && (
            <div className="fade-in">
              <div className="form-field-group">
                 <label className="field-label-new">Alternative Uses</label>
                 <textarea className="field-input-new" rows={3} placeholder="Can this technology be used in other domains?" value={form.alternativeUses[0]} onChange={e => set('alternativeUses', [e.target.value])} />
                 <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 8 }}>Describe up to 3 alternative use-cases for your project (comma separated).</p>
              </div>
            </div>
          )}

          {/* Step 6: Media */}
          {step === 6 && (
            <div className="fade-in">
              <div className="form-field-group">
                 <label className="field-label-new">Pitch / Demo Link</label>
                 <div className="auth-input-wrapper">
                    <Video className="auth-input-icon" size={18} />
                    <input className="field-input-new" style={{ paddingLeft: 40 }} placeholder="https://youtube.com/..." value={form.media[0] || ''} onChange={e => set('media', [e.target.value])} />
                 </div>
                 <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 8 }}>Paste a link to your prototype video or live deployment.</p>
              </div>
            </div>
          )}

          {/* Step 7: Collaboration */}
          {step === 7 && (
            <div className="fade-in">
               <div className="kanban-card glass-card" style={{ padding: 24, border: form.openForCollaboration ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)', cursor: 'pointer' }} onClick={() => set('openForCollaboration', !form.openForCollaboration)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Open for Collaboration</h4>
                        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Allow other builders to send you collaboration requests.</p>
                     </div>
                     <div style={{ width: 24, height: 24, borderRadius: 12, background: form.openForCollaboration ? 'var(--accent-primary)' : 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {form.openForCollaboration && <CheckCircle size={14} color="white" />}
                     </div>
                  </div>
               </div>

               {form.openForCollaboration && (
                 <div className="form-field-group" style={{ marginTop: 24 }}>
                    <label className="field-label-new">Skills Needed</label>
                    <input className="field-input-new" placeholder="Frontend, PCB Design, ML..." value={form.skillsNeeded.join(',')} onChange={e => set('skillsNeeded', e.target.value.split(','))} />
                 </div>
               )}
            </div>
          )}

          {/* Step 8: Review */}
          {step === 8 && (
             <div className="fade-in shadow-card" style={{ padding: 24, borderRadius: 16, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', gap: 24 }}>
                   <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12 }}>{form.title}</h3>
                      <p className="text-muted" style={{ marginBottom: 24 }}>{form.shortDescription}</p>
                      <div className="profile-badges">
                         <span className="badge-item">{form.stage}</span>
                         {form.domainTags.map(t => <span key={t} className="badge-item">{t}</span>)}
                      </div>
                   </div>
                   <div style={{ width: 120, height: 120, background: 'var(--bg-elevated)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                      <Rocket size={48} />
                   </div>
                </div>
             </div>
          )}

        </div>

        {/* Navigation */}
        <div className="wizard-nav">
           <button className="btn btn-secondary btn-nav-prev" onClick={prev} disabled={step === 0}>
             <ChevronLeft size={18} /> Back
           </button>
           
           {step === STEPS.length - 1 ? (
             <button className="btn btn-primary btn-nav-next" onClick={handlePublish} disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Publish Project'} <Rocket size={18} style={{ marginLeft: 8 }} />
             </button>
           ) : (
             <button className="btn btn-primary btn-nav-next" onClick={next} disabled={!canNext()}>
                Continue <ChevronRight size={18} />
             </button>
           )}
        </div>
      </div>
    </div>
  );
}
