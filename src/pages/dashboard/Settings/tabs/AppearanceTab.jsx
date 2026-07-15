import { useApp } from '../../../../context/AppContext';

const AppearanceTab = () => {
  const { theme, toggleTheme } = useApp();

  return (
    <div className="space-y-6 animate-fade-in-up">
      <h2 className="text-xl font-bold text-txt mb-2 transition-colors">Theme Preferences</h2>
      <p className="text-sm text-muted mb-6 transition-colors">Choose how PrepMate looks to you. This setting is saved to your browser.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button 
          onClick={() => { if(theme !== 'light') toggleTheme(); }}
          className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
            theme === 'light' ? 'border-brand bg-brand/5' : 'border-bdr hover:border-bdr2 bg-card2'
          }`}
        >
          <div className="w-full h-24 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-2 flex flex-col gap-2">
            <div className="w-full h-4 bg-[#FFFFFF] rounded border border-[#E2E8F0]"></div>
            <div className="w-3/4 h-4 bg-[#FFFFFF] rounded border border-[#E2E8F0]"></div>
          </div>
          <span className="font-bold text-txt transition-colors">Light Mode</span>
        </button>

        <button 
          onClick={() => { if(theme !== 'dark') toggleTheme(); }}
          className={`flex flex-col items-center gap-4 p-6 rounded-2xl border-2 transition-all ${
            theme === 'dark' ? 'border-brand bg-brand/5' : 'border-bdr hover:border-bdr2 bg-card2'
          }`}
        >
          <div className="w-full h-24 rounded-lg bg-[#0B0E14] border border-[#1F2937] p-2 flex flex-col gap-2">
            <div className="w-full h-4 bg-[#181D2A] rounded border border-[#1F2937]"></div>
            <div className="w-3/4 h-4 bg-[#181D2A] rounded border border-[#1F2937]"></div>
          </div>
          <span className="font-bold text-txt transition-colors">Dark Mode</span>
        </button>
      </div>
    </div>
  );
};

export default AppearanceTab;