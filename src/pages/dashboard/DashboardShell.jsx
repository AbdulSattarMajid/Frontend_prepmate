import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import DashSidebar from '../../components/layout/DashSidebar';
import DashTopbar from '../../components/layout/DashTopbar';
import { Briefcase } from 'lucide-react'; 

// Dashboard Sub-pages
import DashboardHome from './DashboardHome';
import InterviewPage from './InterviewPage';
import ResumePage from './ResumePage';
import SettingsPage from './Settings/SettingsPage';
import AdminPage from './AdminPage';
import LearningModule from './LearningModule'; 

const DASH_PAGE_TITLES = {
  dashboard:'Dashboard', interview:'Practice Interview', resume:'Resume Analyser',
  community:'Community', jobs:'Job Board', settings:'Settings', admin:'Admin Panel',
  learning: 'Knowledge Assessment' 
};

const DashboardShell = () => {
  const navigate = useNavigate();
  const { user } = useApp(); 
  const [active, setActive]     = useState('dashboard');
  const [sideOpen, setSideOpen] = useState(false);

  const onNav = useCallback((dest) => {
    if (['community','premium','landing'].includes(dest)) { 
      const path = dest === 'landing' ? '/' : `/${dest}`;
      navigate(path); 
      return; 
    }
    setActive(dest);
    setSideOpen(false);
  }, [navigate]);

  const title = DASH_PAGE_TITLES[active] || 'Dashboard';

  return (
    <div className="flex min-h-screen bg-deep">
      <DashSidebar active={active} onNav={onNav} sideOpen={sideOpen} setSideOpen={setSideOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <DashTopbar onMenuToggle={() => setSideOpen(v => !v)} title={title} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 animate-in fade-in duration-300">
            {active === 'dashboard' && (
              user?.role === 'admin' ? <AdminPage onNav={onNav} /> : <DashboardHome onNav={onNav} />
            )}

            {active === 'interview'  && <InterviewPage onNav={onNav} />}
            {active === 'resume'     && <ResumePage    onNav={onNav} />}
            {active === 'settings'   && <SettingsPage />}
            {active === 'learning'   && <LearningModule />}
            {active === 'admin'      && <AdminPage     onNav={onNav} />}

            {active === 'jobs' && (
              <div className="flex items-center justify-center h-[60vh] px-4 text-center">
                <div className="max-w-sm rounded-2xl border border-white/10 bg-white/5 px-8 py-10 backdrop-blur-sm">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <p className="mb-2 text-xl font-bold text-white">Job Board</p>
                  <p className="text-sm leading-relaxed text-muted">
                    Curated jobs matched to your resume — coming soon.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;