import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import DashSidebar from '../../components/layout/DashSidebar';
import DashTopbar from '../../components/layout/DashTopbar';

// Dashboard Sub-pages
import DashboardHome from './DashboardHome';
import InterviewPage from './InterviewPage';
import ResumePage from './ResumePage';
import SettingsPage from './Settings/SettingsPage';
import AdminPage from './AdminPage';
import LearningModule from './LearningModule'; 
import JobBoard from './JobBoard'; // 🌟 Added JobBoard Import

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
            {active === 'jobs'       && <JobBoard />} 
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;