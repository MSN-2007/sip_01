import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from 'firebase/auth';
import { Layers, Mail, Lock, ArrowRight, Loader2, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.113.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { loginAsDemo } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      return setError('Please fill in all fields.');
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message.includes('auth/') ? 'Invalid email or password.' : 'Failed to login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (providerName) => {
    try {
      setLoading(true);
      setError('');
      const provider = providerName === 'google' ? new GoogleAuthProvider() : new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (err) {
      console.error("Social Login Error:", err);
      let friendlyMessage = `Failed to sign in with ${providerName === 'google' ? 'Google' : 'GitHub'}.`;
      
      if (err.code === 'auth/popup-closed-by-user') {
        friendlyMessage = 'Login popup was closed before completion.';
      } else if (err.code === 'auth/unauthorized-domain') {
        friendlyMessage = 'This domain is not authorized for Firebase Auth. Please check Firebase Console.';
      } else if (err.code === 'auth/operation-not-allowed') {
        friendlyMessage = `Social login provider not enabled in Firebase Console.`;
      } else {
        friendlyMessage += ` Error: ${err.message}`;
      }
      
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <div className="nav-logo" style={{ marginBottom: 20 }}>
            <Layers className="logo-icon" size={28} />
            <span className="logo-text">System<span className="text-gradient">Space</span></span>
          </div>
          <h2>Welcome Back</h2>
          <p className="text-muted">Sign in to continue building your future.</p>
        </div>

        {error && (
          <div className={`auth-error ${error.includes('authorized') ? 'auth-error-special' : ''}`}>
            {error}
            {error.includes('authorized') && (
              <p style={{ fontSize: '0.75rem', marginTop: 8, color: '#ff8a8a', fontWeight: 500 }}>
                TIP: Log in to Firebase Console and add "localhost" to your Authorized Domains list.
              </p>
            )}
          </div>
        )}
        
        <div className="social-login-group">
          <button 
            type="button" 
            className="btn btn-secondary social-btn"
            onClick={() => handleSocialLogin('google')}
            disabled={loading}
          >
            <GoogleIcon /> Continue with Google
          </button>
          <button 
            type="button" 
            className="btn btn-secondary social-btn"
            onClick={() => handleSocialLogin('github')}
            disabled={loading}
          >
            <GithubIcon /> Continue with GitHub
          </button>
        </div>

        <div className="auth-divider">
          <span>or continue with email</span>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" size={18} />
              <input 
                type="email" 
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" size={18} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : 'Log In'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-footer text-muted">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>

        <div className="showcase-demo-container" style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-subtle)', background: 'rgba(56, 189, 248, 0.05)', borderRadius: 12, padding: 16 }}>
           <h4 style={{ fontSize: '0.875rem', marginBottom: 12, textAlign: 'center', color: 'var(--accent-primary)' }}>Want a quick tour?</h4>
           <button 
             onClick={() => { loginAsDemo(); navigate('/'); }}
             className="btn btn-primary" 
             style={{ width: '100%', background: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, borderRadius: 8 }}
           >
             <Play size={18} fill="currentColor" />
             Launch Showcase Mode (Demo)
           </button>
           <p className="text-muted" style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: 12 }}>
             Perfect for panel presentations. Uses high-quality pre-populated data.
           </p>
        </div>
      </div>
    </div>
  );
}
