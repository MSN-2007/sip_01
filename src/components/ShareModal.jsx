import { useState } from 'react';
import { X, Copy, Check, Mail, Share2, QrCode, ExternalLink } from 'lucide-react';
import './ShareModal.css';

/* ── Platform SVG icons (avoids lucide version issues) ── */
function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function LinkedInIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function TwitterXIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}


export default function ShareModal({ isOpen, onClose, title, url, userName, userTagline }) {
  const [copied, setCopied] = useState(false);
  const [activeToast, setActiveToast] = useState('');

  if (!isOpen) return null;

  /* ── Copy to clipboard ── */
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      showToast('Link copied!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement('textarea');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      showToast('Link copied!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const showToast = (msg) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(''), 2500);
  };

  /* ── Share text ── */
  const shareText = userName
    ? `Check out ${userName}'s AI-generated project portfolio on ProjectSpace! ${userTagline ? `"${userTagline}"` : ''} ${url}`
    : `${title} ${url}`;

  /* ── Platform links ── */
  const platforms = [
    {
      name: 'WhatsApp',
      color: '#25D366',
      Icon: WhatsAppIcon,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'LinkedIn',
      color: '#0077B5',
      Icon: LinkedInIcon,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    },
    {
      name: 'Twitter / X',
      color: '#000000',
      Icon: TwitterXIcon,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Email',
      color: '#6366F1',
      Icon: ({ size }) => <Mail size={size} />,
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText)}`,
    },
  ];


  const openPlatform = (href) => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  /* ── Web Share API (mobile) ── */
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
        showToast('Shared!');
      } catch (e) {
        if (e.name !== 'AbortError') showToast('Share failed');
      }
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-content glass-card" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <header className="share-modal-header">
          <div className="share-header-left">
            <div className="icon-badge"><Share2 size={18} /></div>
            <div>
              <h3 className="share-title">Share Profile</h3>
              {userName && <p className="share-subtitle">{userName}</p>}
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close"><X size={20} /></button>
        </header>

        <div className="share-body">

          {/* URL copy row */}
          <div className="share-copy-area">
            <div className="share-url-container">
              <input
                type="text"
                readOnly
                value={url}
                className="share-url-input"
                onClick={e => e.target.select()}
              />
              <button
                className={`btn-copy ${copied ? 'copied' : ''}`}
                onClick={handleCopy}
                aria-label="Copy link"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Platform buttons */}
          <p className="share-section-label">Share on</p>
          <div className="share-social-grid">
            {platforms.map(({ name, color, Icon, href }) => (
              <button
                key={name}
                className="social-btn"
                onClick={() => openPlatform(href)}
                aria-label={`Share on ${name}`}
              >
                <div className="social-icon-box" style={{ background: color + '18', color }}>
                  <Icon size={20} />
                </div>
                <span className="social-name">{name}</span>
              </button>
            ))}
          </div>

          {/* Native share (mobile) */}
          {typeof navigator !== 'undefined' && navigator.share && (
            <button className="btn btn-secondary" style={{ width: '100%', marginTop: 8 }} onClick={handleNativeShare}>
              <Share2 size={15} /> More sharing options…
            </button>
          )}

          {/* QR placeholder */}
          <div className="share-qr-section">
            <div className="qr-placeholder">
              <QrCode size={90} strokeWidth={1} style={{ opacity: 0.18 }} />
              <span className="qr-tag">QR Code (scan to open)</span>
            </div>
          </div>
        </div>

        <footer className="share-footer">
          <button className="btn btn-secondary" style={{ width: '100%' }} onClick={onClose}>Close</button>
        </footer>

        {/* Toast */}
        {activeToast && <div className="share-toast">{activeToast}</div>}
      </div>
    </div>
  );
}
