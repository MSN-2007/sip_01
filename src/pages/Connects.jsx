import { useMemo, useState, useEffect } from 'react';
import { Users, UserPlus, MessageSquare, Briefcase, Star, Search, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Profile.css';

export default function Connects() {
  const { users, user: currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [requested, setRequested] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    if (currentUser) {
      import('../services/db').then(({ getPendingRequests }) => {
        getPendingRequests(currentUser.id).then(reqs => setPendingRequests(reqs));
      });
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <Users size={64} style={{ color: 'var(--text-muted)' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Connects</h2>
        <p className="text-muted">You must be logged in to find and request collaborators.</p>
        <a href="/login" className="btn btn-primary" style={{ marginTop: '12px' }}>Log In</a>
      </div>
    );
  }

  const handleRequest = async (id) => {
    setLoadingAction(id);
    try {
      const { sendConnectionRequest } = await import('../services/db');
      await sendConnectionRequest(currentUser.id, id);
      setRequested(prev => [...prev, id]);
    } catch(e) {
      alert("Failed to send request: " + e.message);
    }
    setLoadingAction(null);
  };

  const handleAccept = async (connectionId, fromId) => {
    setLoadingAction(connectionId);
    try {
      const { acceptConnectionRequest } = await import('../services/db');
      await acceptConnectionRequest(connectionId);
      setPendingRequests(prev => prev.filter(r => r.id !== connectionId));
      alert("Connection Accepted! You can now message them.");
    } catch(e) {
      alert("Failed to accept: " + e.message);
    }
    setLoadingAction(null);
  };

  const recommended = useMemo(() => {
    return users
      .filter(u => u.id !== currentUser.id)
      .slice(0, 8)
      .map(u => ({ ...u, reason: 'Similar tech stack' }));
  }, [users, currentUser]);

  return (
    <div className="home-page-new">
       <header className="home-top-bar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          <h1 className="section-title-new" style={{ fontSize: '2.5rem' }}>Network</h1>
          <div className="search-container-new" style={{ maxWidth: '100%' }}>
             <Search className="search-icon-new" size={20} />
             <input 
                className="search-input-new" 
                placeholder="Search people, roles, or skills..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
          </div>
       </header>

       <div className="connects-layout-grid">
          
          {/* Main List: Pending Requests */}
          <div className="connects-main">
             <div className="section-header-new">
                <h2 className="section-title-new" style={{ fontSize: '1.5rem', fontWeight: 800 }}><Users size={24} style={{ color: 'var(--accent-primary)', marginRight: 12 }} /> Pending Requests</h2>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {pendingRequests.length > 0 ? pendingRequests.map(req => {
                   const u = users.find(x => x.id === req.from);
                   if (!u) return null;
                   return (
                     <div key={req.id} className="kanban-card glass-card connects-user-card" style={{ padding: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
                        <img src={u.avatar} alt={u.name} className="profile-avatar-large" style={{ width: 80, height: 80, borderRadius: 16 }} />
                        <div style={{ flex: 1 }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                              <div style={{ minWidth: 0 }}>
                                 <h4 style={{ fontSize: '1.2rem', fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.name}</h4>
                                 <p className="text-muted" style={{ fontSize: '0.85rem' }}>{u.tagline}</p>
                              </div>
                              <div className="badge-item" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>New Request</div>
                           </div>
                           <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                              <button 
                                className="btn btn-primary btn-sm" 
                                onClick={() => handleAccept(req.id, req.from)}
                                disabled={loadingAction === req.id}
                              >
                                {loadingAction === req.id ? 'Accepting...' : 'Accept Request'}
                              </button>
                           </div>
                        </div>
                     </div>
                   );
                }) : (
                   <div className="empty-state-new" style={{ padding: 48, textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 24, border: '1px dashed var(--border-subtle)' }}>
                      <Users size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                      <p className="text-muted">You have no pending requests.</p>
                   </div>
                )}
             </div>
          </div>

          {/* Sidebar: Recommended */}
          <div className="connects-sidebar-new">
             <div className="section-header-new">
                <h2 className="section-title-new" style={{ fontSize: '1rem', fontWeight: 700 }}><Star size={20} style={{ color: '#fbbf24', marginRight: 8 }} /> Suggested</h2>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {recommended.map(u => (
                   <div key={u.id} className="kanban-card glass-card" style={{ padding: 16, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                         <img src={u.avatar} alt={u.name} className="avatar" style={{ width: 44, height: 44, borderRadius: 12 }} />
                         <div style={{ minWidth: 0 }}>
                            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, textOverflow: 'ellipsis', overflow: 'hidden' }}>{u.name}</h5>
                            <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600 }}>{u.reason}</span>
                         </div>
                      </div>
                      <button 
                        className={`btn btn-sm ${requested.includes(u.id) ? 'btn-ghost' : 'btn-secondary'}`} 
                        style={{ width: '100%', fontSize: '0.8rem' }}
                        onClick={() => handleRequest(u.id)}
                        disabled={requested.includes(u.id) || loadingAction === u.id}
                      >
                         {requested.includes(u.id) 
                           ? <><Check size={14} /> Requested</> 
                           : loadingAction === u.id 
                             ? 'Sending...'
                             : <><UserPlus size={14} /> Connect</>}
                      </button>
                   </div>
                ))}
             </div>
             
             <div className="kanban-card glass-card" style={{ padding: 24, marginTop: 32, background: 'var(--accent-primary-gradient)', border: 'none' }}>
                <h4 style={{ color: 'white', fontSize: '1.1rem', fontWeight: 800 }}>Expand your network</h4>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', marginTop: 8, marginBottom: 16 }}>Invite fellow builders from your academic community to collaborate.</p>
                <button className="btn btn-secondary" style={{ width: '100%', background: 'white', color: 'var(--accent-primary)', fontWeight: 700, border: 'none' }}>
                   Invite Builders
                </button>
             </div>
          </div>

       </div>
    </div>
  );
}
