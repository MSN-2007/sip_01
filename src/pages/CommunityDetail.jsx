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
              <Search size={20} className="action-icon" />
              <Users size={20} className="action-icon" />
              <Info size={20} className="action-icon" />
           </div>
        </header>

        <div className="messages-container">
           {messages.length === 0 ? (
             <div className="welcome-chat">
                <div className="welcome-icon">{community.icon}</div>
                <h2>Welcome to {community.name}!</h2>
                <p>This is the start of the <strong>#general-discussion</strong> channel. Start building together!</p>
             </div>
           ) : (
             messages.map((m, idx) => {
               const isMe = m.senderId === user?.id;
               const showHeader = idx === 0 || messages[idx - 1].senderId !== m.senderId;
               
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
    </div>
  );
}
