import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Layers, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password) {
      return setError('Please fill in all fields.');
    }

    setLoading(true);
    try {
      // 1. Create User in Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update Display Name in Auth Profile
      await updateProfile(user, { displayName: name });

      // 3. Create initial database document for this user in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        tagline: 'New Builder',
        location: '',
        bio: '',
        followers: 0,
        following: 0,
        projects: 0,
        sdgScore: 0,
        techStack: [],
        domains: [],
        createdAt: new Date().toISOString()
      });

      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message.includes('auth/') ? 'Failed to create account (email might be in use).' : 'An error occurred.');
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
          <h2>Join the Community</h2>
          <p className="text-muted">Create an account to start sharing your projects.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSignup} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <div className="auth-input-wrapper">
              <User className="auth-input-icon" size={18} />
              <input 
                type="text" 
                placeholder="Aanya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          </div>

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
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <Loader2 size={18} className="spin" /> : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="auth-footer text-muted">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
