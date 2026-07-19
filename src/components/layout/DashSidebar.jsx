import { useNavigate } from 'react-router-dom';
import Logo from '../ui/Logo';
import Avatar from '../ui/Avatar';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Brain, Mic, FileText, MessageSquare, Briefcase, Settings, LogOut, Sun, Moon } from 'lucide-react'; // 🌟 Added Sun and Moon icons

const DASH_NAV = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'learning', icon: Brain, label: 'Quizzes' },
  { id: 'interview', icon: Mic, label: 'Practice' },
  { id: 'resume', icon: FileText, label: 'Resume' },
  { id: 'community', icon: MessageSquare, label: 'Community' },
  { id: 'jobs', icon: Briefcase, label: 'Jobs' },
];

export default function DashSidebar({ active, onNav, sideOpen, setSideOpen }) {
  // 🌟 Pulled theme and toggleTheme from AppContext
  const { user, logout, theme, toggleTheme } = useApp();
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay on mobile */}
      {sideOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSideOpen(false)} />
      )}
      <aside
        className={[
          'fixed md:sticky z-30 top-0 left-0 h-full md:h-screen w-60 bg-sidebar border-r border-bdr flex flex-col transition-transform duration-300 shadow-2xl md:shadow-none',
          sideOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        aria-label="App navigation"
      >
        <div className="px-5 py-6 border-b border-bdr">
          <Logo onClick={() => { navigate('/'); setSideOpen(false); }} className="cursor-pointer" />
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          {DASH_NAV.map(item => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNav(item.id); setSideOpen(false); }}
                className={[
                  'relative w-full flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-xl border-0 text-left transition-all duration-150',
                  isActive
                    ? 'bg-gradient-to-r from-brand/15 to-brand/5 text-txt font-semibold shadow-[inset_0_0_0_1px_rgba(56,189,248,0.15)]'
                    : 'bg-transparent text-muted font-medium hover:text-txt hover:bg-card2',
                ].join(' ')}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-brand-lt shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                )}
                <item.icon size={18} strokeWidth={2.25} className={isActive ? 'text-brand-lt' : ''} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-bdr space-y-3">

          {/* 🌟 Settings & Theme Toggle Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onNav('settings'); setSideOpen(false); }}
              className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-muted hover:text-txt hover:bg-card2 rounded-xl bg-transparent border-0 transition-all duration-150 cursor-pointer"
            >
              <Settings size={16} strokeWidth={2.25} />
              Settings
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 text-muted hover:text-txt hover:bg-card2 rounded-xl bg-transparent border border-bdr2 transition-all duration-150 cursor-pointer"
              aria-label="Toggle Theme"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} strokeWidth={2.25} /> : <Moon size={16} strokeWidth={2.25} />}
            </button>
          </div>

          <div className="flex items-center gap-3 px-3 py-2.5 bg-card2 border border-bdr2 rounded-xl">
            {/* 🌟 Updated to show Cloudinary Avatar if it exists */}
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.name} className="w-9 h-9 rounded-full object-cover border border-bdr flex-shrink-0" />
            ) : (
              <Avatar name={user?.name || 'User'} size={36} />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-txt">{user?.name || 'Candidate'}</p>
              <p className="text-[11px] font-medium text-brand-lt">{user?.plan || 'Basic'} Plan</p>
            </div>
            <button
              onClick={logout}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-ghost hover:text-red-400 hover:bg-red-500/10 bg-transparent border-0 transition-colors cursor-pointer"
              aria-label="Log out"
            >
              <LogOut size={14} strokeWidth={2.25} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}