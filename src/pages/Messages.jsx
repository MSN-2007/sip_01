import { useState, useRef, useEffect } from 'react';
import { Send, Search, MessageSquare, MoreVertical, Paperclip, Smile } from 'lucide-react';
import { useApp } from '../context/AppContext';
import './Messages.css';

export default function Messages() {
  const { users, user: me } = useApp();
  const contacts = users.filter(u => u.id !== me.id);
  const [selected, setSelected] = useState(contacts[0]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);
  
  const [msgHistory, setMsgHistory] = useState({
    u2: [
      { id: 1, from: 'u2', text: 'Hey! Loved the SoilSense project. Would love to collaborate on the PCB hardware side.', time: '10:22 AM' },
      { id: 2, from: 'u1', text: 'Thanks Deven! Your PocketScope build is insane btw. What PCB approach were you considering?', time: '10:45 AM' },
      { id: 3, from: 'u2', text: 'Was thinking a custom power management IC + LoRa shield in a compact 2-layer PCB. I can design it in KiCad.', time: '11:01 AM' },
    ],
    u3: [
      { id: 1, from: 'u3', text: 'Hello! I am working on a diagnostic AI for low-resource settings. Noticed you work in similar SDG domains.', time: 'Yesterday' },
      { id: 2, from: 'u1', text: 'Hi Lena! Yes, SDG 3 & 13 are close to my heart. Would love to hear about your retina project!', time: 'Yesterday' },
    ],
    u4: [],
  });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selected, msgHistory]);

  const send = () => {
    if (!input.trim() || !selected) return;
    const newMsg = {
      id: Date.now(),
      from: me.id,
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMsgHistory(h => ({
      ...h,
      [selected.id]: [...(h[selected.id] || []), newMsg],
    }));
    setInput('');
  };

  const messages = msgHistory[selected?.id] || [];

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
             const lastMsg = (msgHistory[u.id] || []).slice(-1)[0];
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
                     <p className="contact-preview-new">{lastMsg ? lastMsg.text : 'Start a discussion…'}</p>
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
                <img src={selected.avatar} alt={selected.name} className="avatar-md" style={{ width: 40, height: 40 }} />
                <div style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <p className="chat-user-name">{selected.name}</p>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                   </div>
                   <p className="chat-user-tag">{selected.tagline.split('•')[0]}</p>
                </div>
                <button className="btn-ghost" style={{ padding: 8 }}><MoreVertical size={20} /></button>
             </header>

             <div className="chat-messages-area">
                {messages.length === 0 && (
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
                <div className="input-container-new">
                   <button className="btn-ghost" style={{ padding: '0 8px' }}><Paperclip size={20} /></button>
                   <input 
                     className="msg-input-field" 
                     placeholder={`Collaborate with ${selected.name.split(' ')[0]}...`}
                     value={input}
                     onChange={e => setInput(e.target.value)}
                     onKeyDown={e => e.key === 'Enter' && send()}
                   />
                   <button className="btn-ghost" style={{ padding: '0 8px' }}><Smile size={20} /></button>
                   <button 
                     className="btn-send-new" 
                     onClick={send}
                     disabled={!input.trim()}
                   >
                      <Send size={18} />
                   </button>
                </div>
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
