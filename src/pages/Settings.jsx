import { useState } from 'react';
import { User, Bell, Shield, Save, CheckCircle2, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { seedDatabase } from '../services/db';
import './Profile.css';

export default function Settings() {
  const { theme, toggleTheme, user, authLoading } = useApp();
  const [saveStatus, setSaveStatus] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSave = () => {
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      alert("Database Seeded Successfully! The cloud now has your data!");
    } catch (e) {
      alert("Error seeding database: " + e.message);
    }
    setIsSeeding(false);
  };

  if (authLoading) {
    return <div className="home-page-new" style={{ padding: 40, textAlign: 'center' }}>Loading Settings...</div>;
  }

  if (!user) {
    return (
      <div className="home-page-new" style={{ padding: 40, textAlign: 'center' }}>
        <h2>Not Logged In</h2>
        <p className="text-muted">You must log in to view settings.</p>
        <a href="/login" className="btn btn-primary" style={{ marginTop: 12 }}>Log In</a>
      </div>
    );
  }

  return (
    <div className="home-page-new">
       <header className="home-top-bar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          <h1 className="section-title-new" style={{ fontSize: '2.5rem' }}>Settings</h1>
          <p className="text-muted">Manage your profile, preferences, and account security.</p>
       </header>

       <div style={{ maxWidth: 800, marginTop: 40 }}>
          
          {/* Profile Section */}
          <section className="kanban-card glass-card" style={{ padding: 32, marginBottom: 32 }}>
             <div className="section-header-new" style={{ marginBottom: 24 }}>
                <h2 className="section-title-new" style={{ fontSize: '1.25rem' }}><User size={20} style={{ color: 'var(--accent-primary)', marginRight: 12 }} /> Profile Settings</h2>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="settings-grid-new">
                   <div className="form-group">
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-muted)' }}>Display Name</label>
                      <input className="search-input-new" style={{ padding: '12px 16px' }} defaultValue={user.name || ''} />
                   </div>
                   <div className="form-group">
                      <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-muted)' }}>Username</label>
                      <input className="search-input-new" style={{ padding: '12px 16px' }} defaultValue={`@${(user.name || 'user').replace(/\s+/g, '').toLowerCase()}`} />
                   </div>
                </div>
                <div className="form-group">
                   <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-muted)' }}>Professional Tagline</label>
                   <input className="search-input-new" style={{ padding: '12px 16px' }} defaultValue={user.tagline || ''} />
                </div>
             </div>
          </section>

          {/* Account Section & Preferences */}
          <section className="kanban-card glass-card" style={{ padding: 32, marginBottom: 32 }}>
             <div className="section-header-new" style={{ marginBottom: 24 }}>
                <h2 className="section-title-new" style={{ fontSize: '1.25rem' }}><Shield size={20} style={{ color: '#10b981', marginRight: 12 }} /> Preferences & Security</h2>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Theme Toggle */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
                   <div>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Appearance</p>
                      <p className="text-muted" style={{ fontSize: '0.8rem' }}>Toggle between Bright Mode and Dark Mode</p>
                   </div>
                   <button 
                     onClick={toggleTheme}
                     className="toggle-switch" 
                     style={{ 
                       width: 44, height: 24, 
                       background: theme === 'dark' ? 'var(--accent-primary)' : 'var(--border-subtle)', 
                       borderRadius: 12, position: 'relative', cursor: 'pointer', border: 'none'
                     }}>
                      <div style={{ 
                        position: 'absolute', 
                        right: theme === 'dark' ? 2 : 'auto', 
                        left: theme === 'dark' ? 'auto' : 2, 
                        top: 2, width: 20, height: 20, 
                        background: 'white', borderRadius: '50%',
                        transition: 'all 0.3s'
                      }} />
                   </button>
                </div>

                {/* Password / Email */}
                <div className="form-group">
                   <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 8, color: 'var(--text-muted)' }}>Email Address</label>
                   <input className="search-input-new" style={{ padding: '12px 16px' }} defaultValue={user.email || ''} readOnly />
                </div>
                <button className="btn btn-outline btn-sm" style={{ width: 'fit-content' }}>Change Password</button>
             </div>
          </section>

          {/* Notifications */}
          <section className="kanban-card glass-card" style={{ padding: 32, marginBottom: 48 }}>
             <div className="section-header-new" style={{ marginBottom: 24 }}>
                <h2 className="section-title-new" style={{ fontSize: '1.25rem' }}><Bell size={20} style={{ color: '#fbbf24', marginRight: 12 }} /> Notifications</h2>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                   { label: 'Project Collaboration Requests', desc: 'Get notified when someone wants to join your project.' },
                   { label: 'Platform Announcements', desc: 'Stay updated with new features and community news.' },
                   { label: 'Messages', desc: 'Direct message notifications from collaborators.' }
                ].map((item, i) => (
                   <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
                      <div>
                         <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.label}</p>
                         <p className="text-muted" style={{ fontSize: '0.8rem' }}>{item.desc}</p>
                      </div>
                      <div className="toggle-switch" style={{ width: 44, height: 24, background: 'var(--accent-primary)', borderRadius: 12, position: 'relative', cursor: 'pointer' }}>
                         <div style={{ position: 'absolute', right: 2, top: 2, width: 20, height: 20, background: 'white', borderRadius: '50%' }} />
                      </div>
                   </div>
                ))}
             </div>
          </section>

          {/* Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
             <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 160 }}>
                {saveStatus === 'saved' ? <CheckCircle2 size={18} /> : <Save size={18} />}
                {saveStatus === 'saved' ? 'Changes Saved' : 'Save Changes'}
             </button>
             <button 
                className="btn btn-outline" 
                onClick={handleSeed}
                disabled={isSeeding}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
             >
                <Database size={18} />
                {isSeeding ? 'Pushing Data...' : '[Admin] Seed Database'}
             </button>
             {saveStatus === 'saved' && <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>Profile updated successfully!</span>}
          </div>

       </div>
    </div>
  );
}
