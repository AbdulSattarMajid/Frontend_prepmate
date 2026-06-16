import Button from '../ui/Button';

const MENU_ITEMS = [
  { id: 'all', icon: '💬', label: 'All Discussions' },
  { id: 'popular', icon: '🔥', label: 'Popular' },
];

const TOPICS = [
  { dot: '#3b82f6', label: 'Interview Experiences' },
  { dot: '#8b5cf6', label: 'Resume Review' },
  { dot: '#3fb950', label: 'Salary & Offer' },
  { dot: '#f59e0b', label: 'General Advice' },
  { dot: '#ef4444', label: 'Question' }
];

const CommunitySidebar = ({ 
  onStartDiscussion, 
  activeMenu, 
  setActiveMenu, 
  activeTopic, 
  setActiveTopic 
}) => {
  
  // Handle clicking a main menu item
  const handleMenuClick = (id) => {
    setActiveMenu(id);
    setActiveTopic(null); // Clear topic filter when changing main menu
  };

  // Handle clicking a specific topic tag
  const handleTopicClick = (label) => {
    setActiveTopic(label);
    setActiveMenu(null); // Clear main menu highlight
  };

  return (
    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
      <Button size="lg" fullWidth onClick={onStartDiscussion} className="font-bold text-sm">
        + Start Discussion
      </Button>

      <div>
        <p className="text-[11px] font-bold text-ghost tracking-widest uppercase mb-3 px-3">Menu</p>
        <div className="space-y-1">
          {MENU_ITEMS.map(item => (
            <button 
              key={item.id} 
              onClick={() => handleMenuClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors border-0 ${activeMenu === item.id ? 'bg-card text-txt font-semibold' : 'bg-transparent text-muted hover:text-txt hover:bg-card/50'}`}
            >
              <span className="text-base">{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-[11px] font-bold text-ghost tracking-widest uppercase mb-3 px-3">Topics</p>
        <div className="space-y-1">
          {TOPICS.map(t => (
            <button 
              key={t.label} 
              onClick={() => handleTopicClick(t.label)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors border-0 ${activeTopic === t.label ? 'bg-card text-txt font-semibold' : 'bg-transparent text-muted hover:text-txt hover:bg-card/50'}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.dot }} />
                <span>{t.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default CommunitySidebar;