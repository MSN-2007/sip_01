import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute'; // New
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProjectDetail from './pages/ProjectDetail';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Communities from './pages/Communities';
import CommunityDetail from './pages/CommunityDetail';
import Messages from './pages/Messages';
import ResumeBuilder from './pages/ResumeBuilder';
import Contributions from './pages/Contributions';
import Connects from './pages/Connects';
import Settings from './pages/Settings';
import Terms from './pages/Terms';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected Routes */}
            <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
            <Route path="/community/:id" element={<ProtectedRoute><CommunityDetail /></ProtectedRoute>} />
            <Route path="/contributions" element={<ProtectedRoute><Contributions /></ProtectedRoute>} />
            <Route path="/connects" element={<ProtectedRoute><Connects /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="/resume" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
