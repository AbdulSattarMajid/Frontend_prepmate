import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../ui/Logo';
import Button from '../ui/Button';
import { useApp } from '../../context/AppContext';

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

        {/* Desktop nav */}
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

        {/* Desktop CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted hover:bg-card hover:text-txt transition-all border border-transparent hover:border-bdr"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          <div className="h-5 w-px bg-bdr"></div>

          {user ? (
            <div className="flex items-center gap-4">
              <div 
                title="Community Points"
                className="flex items-center gap-1.5 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-brand-lt text-xs font-bold cursor-help"
              >
                <span>🏆</span>
                <span>{user.communityPoints || 0}</span>
              </div>

              {/* 🌟 UPDATED: Points to /dashboard/settings */}
              <button 
                onClick={() => navigate('/dashboard/settings')} 
                className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-bdr hover:border-brand transition-colors focus:outline-none"
                title="Settings & Profile"
              >
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-brand/20 text-brand-lt flex items-center justify-center font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
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
          <button onClick={toggleTheme} className="p-2 text-muted">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            className="bg-card border border-bdr2 rounded-lg p-2 text-muted"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-bdr px-4 py-4 flex flex-col gap-3 animate-fade-up">
          {user && (
            <div className="flex items-center gap-3 p-3 bg-card2 rounded-xl border border-bdr mb-2">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-bdr">
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
                <span className="text-xs text-brand-lt font-medium">🏆 {user.communityPoints || 0} Points</span>
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
                {/* 🌟 UPDATED: Mobile link to /dashboard/settings */}
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