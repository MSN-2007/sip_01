import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Send, 
  Hash, 
  Users, 
  Settings, 
  Search, 
  MoreVertical, 
  MessageSquare,
  ArrowLeft,
  Info,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { subscribeToCommunityMessages, sendCommunityMessage } from '../services/db';
import './CommunityDetail.css';

export default function CommunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { communities, user, authLoading } = useApp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef(null);
  
  // New states for header actions
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { users } = useApp(); // To display mock members

  const community = communities.find(c => c.id === id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToCommunityMessages(id, (msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!community) {
    return (
      <div className="community-empty-state">
        <p>Community not found or you don't have access.</p>
        <Link to="/communities" className="btn btn-primary">Back to Communities</Link>
      </div>
    );
  }

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isSending || !user) return;

    setIsSending(true);
    try {
      await sendCommunityMessage(id, {
        senderId: user.id,
        senderName: user.name,
        senderAvatar: user.avatar,
        text: input.trim(),
      });
      setInput('');
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setIsSending(false);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.senderName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="community-chat-layout fade-in">
      {/* Sidebar - Community Info */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
           <div className="community-icon-lg">{community.icon}</div>
           <h3 className="community-name-lg">{community.name}</h3>
           <p className="community-domain-lg">{community.domain}</p>
        </div>
        
        <div className="sidebar-section">
           <h4 className="section-label"><Hash size={14} /> MAIN GROUP</h4>
           <div className="channel-item active">
              <MessageSquare size={16} /> <span>general-discussion</span>
           </div>
        </div>

        <div className="sidebar-section">
           <h4 className="section-label"><Users size={14} /> MEMBERS</h4>
           <p className="section-count">{community.members.toLocaleString()} builders in this group</p>
        </div>
        
        <div className="community-bio-card">
           <p>{community.description}</p>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main">
        <header className="chat-top-nav">
           <div className="chat-header-info">
              <button onClick={() => navigate('/communities')} className="btn-back">
                <ArrowLeft size={20} />
              </button>
              <Hash size={20} className="text-muted" />
              <h2 className="chat-title">general-discussion</h2>
           </div>
           <div className="chat-header-actions">
              <Search size={20} className="action-icon hover-opacity" style={{ cursor: 'pointer' }} onClick={() => setShowSearch(!showSearch)} />
              <Users size={20} className="action-icon hover-opacity" style={{ cursor: 'pointer' }} onClick={() => setShowMembersModal(true)} />
              <Info size={20} className="action-icon hover-opacity" style={{ cursor: 'pointer' }} onClick={() => setShowInfoModal(true)} />
           </div>
        </header>

        {showSearch && (
          <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-elevated)' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search messages..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        )}

        <div className="messages-container">
           {filteredMessages.length === 0 ? (
             <div className="welcome-chat">
                <div className="welcome-icon">{community.icon}</div>
                <h2>{searchQuery ? 'No messages found.' : `Welcome to ${community.name}!`}</h2>
                <p>{searchQuery ? 'Try a different search term.' : 'This is the start of the #general-discussion channel. Start building together!'}</p>
             </div>
           ) : (
             filteredMessages.map((m, idx) => {
               const isMe = m.senderId === user?.id;
               const showHeader = idx === 0 || filteredMessages[idx - 1].senderId !== m.senderId;
               
               return (
                 <div key={m.id} className={`message-item ${showHeader ? 'with-header' : 'no-header'}`}>
                    {showHeader && (
                      <div className="message-header">
                         <img src={m.senderAvatar} alt={m.senderName} className="message-avatar" />
                         <div className="message-meta">
                            <span className="sender-name">{m.senderName}</span>
                            <span className="message-time">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         </div>
                      </div>
                    )}
                    <div className="message-content-wrapper">
                       {!showHeader && <div className="time-hover">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                       <div className="message-bubble">
                          {m.text}
                       </div>
                    </div>
                 </div>
               );
             })
           )}
           <div ref={chatEndRef} />
        </div>

        <footer className="chat-footer">
           <form className="message-form" onSubmit={handleSend}>
              <div className="input-wrapper">
                 <button type="button" className="btn-plus">+</button>
                 <input 
                   type="text" 
                   className="chat-input" 
                   placeholder={`Message #general-discussion`}
                   value={input}
                   onChange={e => setInput(e.target.value)}
                 />
                 <button type="submit" className="btn-send" disabled={!input.trim() || isSending}>
                    <Send size={18} />
                 </button>
              </div>
           </form>
        </footer>
      </main>

      {/* Members Modal */}
      {showMembersModal && (
        <div className="modal-overlay" onClick={() => setShowMembersModal(false)} style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ width: 400, maxWidth: '90%', padding: 24, borderRadius: 16 }}>
            <h3 style={{ marginBottom: 16, fontSize: '1.2rem', fontWeight: 800 }}>Community Members</h3>
            <div style={{ maxHeight: 300, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {users.slice(0, 10).map(u => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={u.avatar} alt={u.name} style={{ width: 40, height: 40, borderRadius: '50%' }} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>{u.name}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.tagline.split('•')[0]}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: 20 }} onClick={() => setShowMembersModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="modal-overlay" onClick={() => setShowInfoModal(false)} style={{ zIndex: 1000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()} style={{ width: 400, maxWidth: '90%', padding: 24, borderRadius: 16 }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: '3rem', marginBottom: 8 }}>{community.icon}</div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{community.name}</h3>
              <p style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 700 }}>{community.domain}</p>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 20 }}>{community.description}</p>
            <div style={{ background: 'var(--bg-elevated)', padding: 12, borderRadius: 8, marginBottom: 20 }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}><Users size={14} style={{ display: 'inline', marginRight: 4 }} /> {community.members.toLocaleString()} members</p>
            </div>
            <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setShowInfoModal(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
}
