import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

export default function Terms() {
  const navigate = useNavigate();

  return (
    <div className="home-page-new">
       <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ marginBottom: 24, paddingLeft: 0 }}>
          <ArrowLeft size={18} /> Back
       </button>
       
       <header className="home-top-bar" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          <h1 className="section-title-new" style={{ fontSize: '2.5rem' }}>Terms & Conditions</h1>
          <p className="text-muted">Last updated: April 6, 2026</p>
       </header>

       <div className="kanban-card glass-card" style={{ padding: 48, marginTop: 40, lineHeight: 1.8, color: 'var(--text-secondary)', maxWidth: 900 }}>
          <section style={{ marginBottom: 40 }}>
             <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>1. User Agreement</h2>
             <p>Welcome to ProjectSpace. By accessing or using our platform, you agree to bound by these terms. Our network is designed for academic collaboration, problem-solving, and professional project visibility. Any misuse for social media simulation or non-academic purposes is strictly prohibited.</p>
          </section>

          <section style={{ marginBottom: 40 }}>
             <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>2. Project Integrity</h2>
             <p>Users are responsible for the authenticity of the project data they upload. You must own the rights to the solution or have permission from your academic institution to showcase the work. Plagiarism will result in immediate account suspension and removal of all contributions.</p>
          </section>

          <section style={{ marginBottom: 40 }}>
             <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>3. Collaboration Standards</h2>
             <p>When joining a project, you agree to contribute meaningfully to the problem-solving process. Creators have the right to manage their teams and remove inactive collaborators. Respectful communication and professional conduct are mandatory across all connects and messages.</p>
          </section>

          <section style={{ marginBottom: 40 }}>
             <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>4. Privacy & Data</h2>
             <p>Your project data and professional profile are visible to the network to facilitate discovery. We do not sell your personal information to third parties. AI-generated resumes and analytics are based solely on the data you provide within your projects.</p>
          </section>

          <section>
             <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, marginBottom: 16 }}>5. Platform Liability</h2>
             <p>ProjectSpace is a facilitation tool and is not liable for any intellectual property disputes or outcomes of collaborations formed on the platform. Users are encouraged to establish their own NDAs or formal agreements for sensitive projects.</p>
          </section>
       </div>
    </div>
  );
}
