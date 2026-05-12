import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Search, MessageSquare, MoreVertical, Paperclip, Smile, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { subscribeToDirectMessages, sendDirectMessage, initDirectMessageChat } from '../services/db';
import './Messages.css';

export default function Messages() {
  const navigate = useNavigate();
  const { users, user: me, authLoading } = useApp();
  const contacts = users.filter(u => u.id !== (me?.id || undefined));
  const [selected, setSelected] = useState(contacts[0] || null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [listenerError, setListenerError] = useState(null);
  const chatEndRef = useRef(null);
  
  useEffect(() => {
    if (!authLoading && !me) {
      navigate('/login');
    }
  }, [me, authLoading, navigate]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!me || !selected) {
      setMessages([]);
      setListenerError(null);
      return;
    }

    setListenerError(null);

    // Start listening IMMEDIATELY — do not wait for initDirectMessageChat.
    // This ensures we always receive messages even if the parent doc doesn't exist yet.
    const unsubscribe = subscribeToDirectMessages(
      me.id,
      selected.id,
      (msgs) => {
        setMessages(msgs);
        setListenerError(null);
        setTimeout(scrollToBottom, 100);
      },
      (err) => {
        console.error('Message listener error:', err.code, err.message);
        setListenerError(err.code || 'unknown-error');
      }
    );

    // Init the parent chat doc in the background (needed for writes, not reads).
    initDirectMessageChat(me.id, selected.id).catch(err => {
      console.warn('initDirectMessageChat failed (non-critical):', err.code, err.message);
    });

    return () => unsubscribe();
  }, [me, selected]);

  const send = async (e) => {
    e?.preventDefault();
    if (!input.trim() || !selected || !me || isSending) return;
    
    setIsSending(true);
    try {
      await sendDirectMessage(me.id, selected.id, {
        from: me.id,
        text: input.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      setInput('');
    } catch (err) {
      console.error("Failed to send message", err);
      alert("Error sending message: " + err.message);
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading || !me) {
    return <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>Loading...</div>;
  }

  return (
    <div className="messages-page-new">
      
      {/* Internal Sidebar: Contacts */}
      <aside className="msg-sidebar-new">
        <header className="msg-sidebar-header">
           <h2 className="msg-sidebar-title">Messages</h2>
           <div className="msg-search-new">
              <Search className="msg-search-icon" size={16} />
              <input type="text" className="msg-search-input" placeholder="Search builders..." />
           </div>
        </header>

        <div className="contacts-list-new">
           {contacts.map(u => {
             const isActive = selected?.id === u.id;
             return (
               <button 
                 key={u.id} 
                 className={`contact-item-new ${isActive ? 'active' : ''}`}
                 onClick={() => setSelected(u)}
               >
                  <img src={u.avatar} alt={u.name} className="avatar-md" />
                  <div className="contact-meta-new">
                     <p className="contact-name-new">{u.name}</p>
                     <p className="contact-preview-new">Click to view discussion</p>
                  </div>
               </button>
             );
           })}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="chat-main-new">
         {selected ? (
           <>
             <header className="chat-header-new">
                <img 
                  src={selected.avatar} 
                  alt={selected.name} 
                  className="avatar-md hover-opacity" 
                  style={{ width: 40, height: 40, cursor: 'pointer' }} 
                  onClick={() => navigate(`/profile/${selected.id}`)}
                />
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p 
                        className="chat-user-name hover-underline" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${selected.id}`)}
                      >
                        {selected.name}
                      </p>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                   </div>
                   <p className="chat-user-tag">{selected.tagline?.split('•')[0]}</p>
                </div>
                <button className="btn-ghost" style={{ padding: 8 }}><MoreVertical size={20} /></button>
             </header>

             <div className="chat-messages-area">
                {listenerError && (
                   <div style={{ margin: 16, padding: 12, background: '#7f1d1d', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
                     <AlertCircle size={18} color="#fca5a5" />
                     <span style={{ color: '#fca5a5' }}>
                       Could not load messages ({listenerError}). Check Firestore rules are published.
                     </span>
                   </div>
                )}
                {messages.length === 0 && !listenerError && (
                   <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                      <MessageSquare size={48} style={{ marginBottom: 16 }} />
                      <p>Start a problem-driven discussion with {selected.name}</p>
                   </div>
                )}
                {messages.map((m) => {
                  const isMe = m.from === me.id;
                  return (
                    <div key={m.id} className={`msg-wrapper-new ${isMe ? 'me' : 'them'}`}>
                       <div className={`msg-bubble-new ${isMe ? 'me' : 'them'}`}>
                          {m.text}
                       </div>
                       <span className="msg-time-new">{m.time}</span>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
             </div>

             <footer className="chat-input-area">
                <form className="input-container-new" onSubmit={send}>
                   <button type="button" className="btn-ghost" style={{ padding: '0 8px' }}><Paperclip size={20} /></button>
                   <input 
                     className="msg-input-field" 
                     placeholder={`Message ${selected.name.split(' ')[0]}...`}
                     value={input}
                     onChange={e => setInput(e.target.value)}
                   />
                   <button type="button" className="btn-ghost" style={{ padding: '0 8px' }}><Smile size={20} /></button>
                   <button 
                     type="submit"
                     className="btn-send-new" 
                     disabled={!input.trim() || isSending}
                   >
                      <Send size={18} />
                   </button>
                </form>
             </footer>
           </>
         ) : (
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
             <MessageSquare size={64} style={{ marginBottom: 24 }} />
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Your Workspace</h2>
             <p>Select a collaborator to start building.</p>
           </div>
         )}
      </main>

    </div>
  );
}
