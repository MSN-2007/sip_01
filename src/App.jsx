import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ProjectDetail from './pages/ProjectDetail';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import Communities from './pages/Communities';
import Messages from './pages/Messages';
import ResumeBuilder from './pages/ResumeBuilder';
import Contributions from './pages/Contributions';
import Connects from './pages/Connects';
import Settings from './pages/Settings';
import Terms from './pages/Terms';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/connects" element={<Connects />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/resume" element={<ResumeBuilder />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/terms" element={<Terms />} />
            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
