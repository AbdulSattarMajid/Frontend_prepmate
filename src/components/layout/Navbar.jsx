import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { Trophy, Sun, Moon, Menu, X, Star, Crown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Practice',  page: '/dashboard' }, 
  { label: 'FAQ' ,      page: '/faq' },   
  { label: 'Community', page: '/community' },
  { label: 'Pricing',   page: '/premium' },
];

export default function Navbar() {
  const { user, logout, theme, toggleTheme } = useApp();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-deep/95 backdrop-blur-md border-b border-bdr transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
        <Logo onClick={() => navigate('/')} /> 

        <ul className="hidden md:flex items-center gap-7 list-none m-0 p-0">
          {NAV_LINKS.map(l => (
            <li key={l.label}>
              <button
                onClick={() => l.page && navigate(l.page)}
                className={`bg-transparent border-0 text-sm font-medium transition-colors duration-150 pb-0.5 border-b-2 ${
                  location.pathname === l.page ? 'text-txt border-brand-lt' : 'text-muted border-transparent hover:text-txt'
                } ${l.page ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted hover:bg-card hover:text-txt transition-all border border-transparent hover:border-bdr flex items-center justify-center"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <div className="h-5 w-px bg-bdr"></div>

          {user ? (
            <div className="flex items-center gap-4">
              <div 
                title="Community Points"
                className="flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-brand-lt text-xs font-bold cursor-help"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>{user.points || 0}</span>
              </div>

              {/* 🌟 PREMIUM PROFILE UI */}
              <button 
                onClick={() => navigate('/dashboard/settings')} 
                className="relative flex items-center justify-center focus:outline-none group"
                title="Settings & Profile"
              >
                {/* Gradient Border Container */}
                <div className={`p-[3px] rounded-full transition-all duration-300 ${
                  user.plan === 'Elite' ? 'bg-gradient-to-tr from-amber-300 via-yellow-500 to-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                  user.plan === 'Pro' ? 'bg-gradient-to-tr from-blue-400 to-indigo-600 shadow-[0_0_15px_rgba(59,130,246,0.3)]' :
                  'bg-bdr'
                }`}>
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-deep">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-brand/20 text-brand-lt flex items-center justify-center font-bold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Badge Icon */}
                {user.plan && user.plan !== 'Basic' && (
                  <div className={`absolute -bottom-1 -right-1 z-10 w-5 h-5 rounded-full flex items-center justify-center border-2 border-deep text-white
                    ${user.plan === 'Elite' ? 'bg-amber-500' : 'bg-blue-600'}`}
                  >
                    {user.plan === 'Elite' ? <Crown className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                  </div>
                )}
              </button>
            </div>
          ) : (
            <div className="flex gap-2.5">
              <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>Log In</Button>
              <Button size="sm" onClick={() => navigate('/signup')}>Sign Up Free</Button>
            </div>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={toggleTheme} className="p-2 text-muted flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            className="bg-card border border-bdr2 rounded-lg p-2 text-muted flex items-center justify-center"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-bdr px-4 py-4 flex flex-col gap-3 animate-fade-up">
          {user && (
            <div className="flex items-center gap-3 p-3 bg-card2 rounded-xl border border-bdr mb-2">
              <div className="w-10 h-10 rounded-full border-2 border-brand-lt overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand/20 text-brand-lt flex items-center justify-center font-bold text-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-txt">{user.name}</span>
                <span className="text-xs text-brand-lt font-medium flex items-center gap-1 mt-0.5">
                  <Trophy className="w-3 h-3" /> {user.points || 0} Points
                </span>
              </div>
            </div>
          )}

          {NAV_LINKS.map(l => (
            <button key={l.label} onClick={() => { l.page && navigate(l.page); setMenuOpen(false); }}
              className="bg-transparent border-0 text-left text-sm text-muted hover:text-txt py-2 border-b border-bdr last:border-0">
              {l.label}
            </button>
          ))}
          
          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <>
                <Button variant="ghost" size="sm" onClick={() => { navigate('/dashboard'); setMenuOpen(false); }}>Dashboard</Button>
                <Button variant="ghost" size="sm" onClick={() => { navigate('/dashboard/settings'); setMenuOpen(false); }}>Settings</Button>
                <Button variant="danger" size="sm" onClick={() => { logout(); setMenuOpen(false); }}>Log Out</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => { navigate('/login'); setMenuOpen(false); }}>Log In</Button>
                <Button size="sm" onClick={() => { navigate('/signup'); setMenuOpen(false); }}>Sign Up Free</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}