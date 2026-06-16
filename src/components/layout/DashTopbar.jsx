import React from 'react';
import { Link } from 'react-router-dom';

const DashTopbar = ({ onMenuToggle, title }) => (
  <header className="md:hidden sticky top-0 z-10 bg-deep/95 backdrop-blur border-b border-bdr h-14 flex items-center px-4 gap-3">
    <button 
      onClick={onMenuToggle} 
      className="bg-transparent border border-bdr2 rounded-lg p-1.5 text-muted"
      aria-label="Open sidebar"
    >
      ☰
    </button>
    <Link to="/">
      <span className="font-sora font-bold text-base">{title}</span>
    </Link>
  </header>
);

export default DashTopbar;
