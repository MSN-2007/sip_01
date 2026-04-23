import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Save, 
  CheckCircle2, 
  Database, 
  Moon, 
  Sun, 
  Lock, 
  Mail,
  Palette,
  Layout
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { seedDatabase } from '../services/db';
import './Settings.css';

export default function Settings() {
  const { theme, toggleTheme, user, authLoading } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [saveStatus, setSaveStatus] = useState(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 800);
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
    return <div className="settings-page" style={{ textAlign: 'center', paddingTop: 100 }}>Loading Settings...</div>;
  }

  if (!user) {
    return (
      <div className="settings-page" style={{ textAlign: 'center', paddingTop: 100 }}>
        <h2>Access Denied</h2>
        <p className="text-muted">Please log in to manage your account settings.</p>
        <button onClick={() => window.location.href = '/login'} className="btn btn-primary" style={{ marginTop: 24 }}>Log In</button>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="settings-page">
      <header className="settings-header">
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: 8 }}>Account Settings</h1>
        <p className="text-muted">Customize your developer profile and preferences.</p>
      </header>

      <div className="settings-layout">
        {/* Sidebar Nav */}
        <aside className="settings-sidebar">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
          
          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
             <button 
                className="btn btn-ghost btn-sm" 
                onClick={handleSeed}
                disabled={isSeeding}
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.75rem', opacity: 0.6 }}
             >
                <Database size={14} /> {isSeeding ? 'Seeding...' : 'Seed Data'}
             </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="settings-content">
          
          {activeTab === 'profile' && (
            <div className="settings-section-card glass-card">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Public Profile</h2>
                <p className="settings-section-desc">Manage how you appear to the builder community.</p>
              </div>

              <div className="settings-input-group">
                <div className="form-group">
                  <label className="settings-label">Display Name</label>
                  <input className="form-input" defaultValue={user.name} />
                </div>
                <div className="form-group">
                  <label className="settings-label">Username</label>
                  <div style={{ position: 'relative' }}>
                    <input className="form-input" style={{ paddingLeft: 36 }} defaultValue={user.name?.toLowerCase().replace(/\s/g, '')} />
                    <span style={{ position: 'absolute', left: 14, top: 12, color: 'var(--text-muted)' }}>@</span>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 24 }}>
                <label className="settings-label">Professional Tagline</label>
                <input className="form-input" placeholder="e.g. IoT Architect | Fullstack Developer" defaultValue={user.tagline} />
              </div>

              <div className="form-group">
                <label className="settings-label">Bio</label>
                <textarea className="form-input" rows={4} placeholder="Tell the world about your building journey..." defaultValue={user.bio} />
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="settings-section-card glass-card">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Account Security</h2>
                <p className="settings-section-desc">Manage your authentication methods and security.</p>
              </div>

              <div className="settings-row">
                <div className="settings-info">
                  <span className="settings-label">Email Address</span>
                  <p className="settings-section-desc">{user.email}</p>
                </div>
                <div className="chip chip-tech" style={{ borderRadius: 6 }}>Verified</div>
              </div>

              <div className="settings-row">
                <div className="settings-info">
                  <span className="settings-label">Password</span>
                  <p className="settings-section-desc">Last changed 3 months ago</p>
                </div>
                <button className="btn btn-ghost btn-sm">Update</button>
              </div>

              <div className="settings-row">
                <div className="settings-info">
                  <span className="settings-label">Two-Factor Authentication</span>
                  <p className="settings-section-desc">Add an extra layer of security to your account.</p>
                </div>
                <button className="btn btn-secondary btn-sm">Enable</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section-card glass-card">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Notification Preferences</h2>
                <p className="settings-section-desc">Choose what updates you want to receive.</p>
              </div>

              {[
                { id: 'collab', label: 'Collaboration Requests', desc: 'When someone wants to join your project team.' },
                { id: 'msgs', label: 'Direct Messages', desc: 'New messages in your inbox or group chats.' },
                { id: 'updates', label: 'Product Updates', desc: 'Updates about new SIP_01 features and news.' },
                { id: 'mentions', label: 'Mentions', desc: 'When someone tags you in a community.' }
              ].map((item) => (
                <div key={item.id} className="settings-row">
                  <div className="settings-info">
                    <span className="settings-label">{item.label}</span>
                    <p className="settings-section-desc">{item.desc}</p>
                  </div>
                  <div className="toggle-switch-new" style={{ 
                    width: 44, height: 24, background: 'var(--accent-primary)', 
                    borderRadius: 22, position: 'relative', cursor: 'pointer' 
                  }}>
                    <div style={{ position: 'absolute', right: 2, top: 2, width: 20, height: 20, background: 'white', borderRadius: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="settings-section-card glass-card">
              <div className="settings-section-header">
                <h2 className="settings-section-title">Interface Themes</h2>
                <p className="settings-section-desc">Choose a look that suits your development style.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                <div 
                  className={`theme-card ${theme !== 'light' ? 'active' : ''}`}
                  onClick={() => theme === 'light' && toggleTheme()}
                  style={{ 
                    padding: 20, borderRadius: 12, border: '2px solid', 
                    borderColor: theme !== 'light' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    cursor: 'pointer', background: '#09090b', color: 'white'
                  }}
                >
                  <Moon size={24} style={{ marginBottom: 12 }} />
                  <p style={{ fontWeight: 700 }}>Midnight Dark</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>Default premium dark mode.</p>
                </div>

                <div 
                  className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => theme !== 'light' && toggleTheme()}
                  style={{ 
                    padding: 20, borderRadius: 12, border: '2px solid', 
                    borderColor: theme === 'light' ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    cursor: 'pointer', background: '#fbfbfd', color: '#18181b'
                  }}
                >
                  <Sun size={24} style={{ marginBottom: 12 }} />
                  <p style={{ fontWeight: 700 }}>Pristine Light</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.7 }}>High contrast light theme.</p>
                </div>
              </div>
            </div>
          )}

          <div className="settings-footer">
             {saveStatus === 'saved' && <span style={{ color: 'var(--accent-secondary)', fontSize: '0.875rem', alignSelf: 'center', fontWeight: 600 }}>Preferences updated!</span>}
             <button className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
             <button className="btn btn-primary" onClick={handleSave} disabled={saveStatus === 'saving'}>
                {saveStatus === 'saving' ? 'Saving...' : (saveStatus === 'saved' ? 'Saved' : 'Save Changes')}
                {saveStatus !== 'saving' && <Save size={16} />}
             </button>
          </div>

        </main>
      </div>
    </div>
  );
}
