import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useApp();
  const location = useLocation();

  if (authLoading) {
    return (
      <div style={{ 
        height: '100vh', display: 'flex', 
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary)', color: 'var(--text-primary)'
      }}>
        <div className="spinner">Loading Secure Session...</div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login but save the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
