import { useNavigate } from 'react-router-dom'; 
import Logo from '../ui/Logo';
import Avatar from '../ui/Avatar';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, Brain, Mic, FileText, MessageSquare, Briefcase, Settings, LogOut, Sun, Moon } from 'lucide-react'; // 🌟 Added Sun and Moon icons

const DASH_NAV = [
  { id:'dashboard',  icon:LayoutDashboard, label:'Dashboard' },
  { id:'learning',   icon:Brain,           label:'Quizzes' },
  { id:'interview',  icon:Mic,             label:'Practice' },
  { id:'resume',     icon:FileText,        label:'Resume' },
  { id:'community',  icon:MessageSquare,   label:'Community' },
  { id:'jobs',       icon:Briefcase,       label:'Jobs' },
];

export default function DashSidebar({ active, onNav, sideOpen, setSideOpen })  {
  // 🌟 Pulled theme and toggleTheme from AppContext
  const { user, logout, theme, toggleTheme } = useApp(); 
  const navigate = useNavigate();    
  
  return (
    <>
      {/* Overlay on mobile */}
      {sideOpen && (
        <div className="fixed inset-0 z-20 bg-black/60 md:hidden" onClick={() => setSideOpen(false)} />
      )}
      <aside
        className={[
          'fixed md:sticky z-30 top-0 left-0 h-full md:h-screen w-60 bg-sidebar border-r border-bdr flex flex-col transition-transform duration-300',
          sideOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
        aria-label="App navigation"
      >
        <div className="px-5 py-6 border-b border-bdr">
          <Logo onClick={() => { navigate('/'); setSideOpen(false); }} className="cursor-pointer" />
        </div>

        <nav className="flex-1 py-3 overflow-y-auto">
          {DASH_NAV.map(item => (
            <button
              key={item.id}
              onClick={() => { onNav(item.id); setSideOpen(false); }}
              className={[
                'w-full flex items-center gap-3 px-5 py-3 text-sm font-medium border-0 text-left transition-all duration-150 border-l-[3px]',
                active===item.id
                  ? 'bg-brand/10 text-txt border-brand-lt font-semibold'
                  : 'bg-transparent text-muted border-transparent hover:text-txt hover:bg-card2',
              ].join(' ')}
            >
              <item.icon size={18} strokeWidth={2} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-bdr space-y-2">
          
          {/* 🌟 Settings & Theme Toggle Row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onNav('settings'); setSideOpen(false); }}
              className="flex-1 flex items-center gap-3 px-3 py-2.5 text-sm text-muted hover:text-txt hover:bg-card2 rounded-xl bg-transparent border-0 transition-all duration-150 cursor-pointer"
            >
              <Settings size={16} strokeWidth={2} />
              Settings
            </button>
            
            <button
              onClick={toggleTheme}
              className="p-2.5 text-muted hover:text-txt hover:bg-card2 rounded-xl bg-transparent border-0 transition-all duration-150 cursor-pointer"
              aria-label="Toggle Theme"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
            </button>
          </div>

          <div className="flex items-center gap-3 px-3 py-2.5 bg-card2 rounded-xl">
            {/* 🌟 Updated to show Cloudinary Avatar if it exists */}
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user?.name} className="w-9 h-9 rounded-full object-cover border border-bdr" />
            ) : (
              <Avatar name={user?.name||'User'} size={36} />
            )}
            
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate text-txt">{user?.name||'Candidate'}</p>
              <p className="text-[11px] text-brand-lt">{user?.plan||'Pro'} Plan</p>
            </div>
            <button onClick={logout} className="ml-auto text-ghost text-xs hover:text-red-500 bg-transparent border-0 transition-colors cursor-pointer" aria-label="Log out">
              <LogOut size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}