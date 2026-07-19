import { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { interviewApi } from '../../../services/interviewApi';
import { Code2, Server, Layout, Database, Braces, Boxes, ListChecks, Sparkles, Coins, Gift } from 'lucide-react';

const ROLES = [
  { label: "Python", icon: Code2 },
  { label: "Python Backend", icon: Server },
  { label: "Frontend (React)", icon: Layout },
  { label: "MERN Stack", icon: Boxes },
  { label: "MySQL / Databases", icon: Database },
  { label: "JavaScript", icon: Braces },
];

const LEVELS = [
  { label: "Junior", bars: 1 },
  { label: "Intermediate", bars: 2 },
  { label: "Senior", bars: 3 },
];

const MODES = [
  { label: "Full Interview", desc: "Theory + live coding round", icon: ListChecks },
  { label: "Coding Challenge Only", desc: "Jump straight into code", icon: Code2 },
];

const SetupPhase = ({ role, setRole, level, setLevel, mode, setMode, startSession, loading }) => {
  const { user } = useApp(); // 🌟 Pull in user for token balance
  const [aiReady, setAiReady] = useState(false);

  useEffect(() => {
    interviewApi.wakeUpAI().then(() => setAiReady(true)).catch(() => {});
  }, []);

  // 🌟 Dynamic Cost Calculation
  const tokenCost = mode === "Coding Challenge Only" ? 10 : 20;

  // 🌟 Free Daily Badge Logic
  const lastClaim = new Date(user?.lastDailyRewardDate || 0);
  const today = new Date();
  const isNewDay = lastClaim.getDate() !== today.getDate() || 
                   lastClaim.getMonth() !== today.getMonth() || 
                   lastClaim.getFullYear() !== today.getFullYear();

  return (
    <div className="p-5 md:p-8 animate-fade-up max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">Candidate Registration</h1>
          <p className="text-muted mt-1">Customize your AI interview environment.</p>
        </div>
        
        {/* 🌟 Status & Token Badges */}
        <div className="flex flex-wrap items-center gap-3">
          <span className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border border-bdr2 whitespace-nowrap ${aiReady ? 'text-brand' : 'text-muted'}`}>
            <span className={`w-2 h-2 rounded-full ${aiReady ? 'bg-brand' : 'bg-muted animate-pulse'}`} />
            {aiReady ? 'AI engine ready' : 'Warming up AI'}
          </span>

          <span className="flex items-center gap-1.5 text-sm font-bold bg-deep px-3 py-1.5 rounded-full border border-brand/30 text-brand-lt shadow-sm">
            <Coins size={16} className="text-brand" /> 
            {user?.tokens || 0} Tokens
          </span>
        </div>
      </div>

      <Card className="p-6 space-y-6 relative overflow-hidden">
        {/* 🌟 The Free Badge */}
        {isNewDay && (
          <div className="absolute top-0 right-0 bg-brand text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg flex items-center gap-1.5 animate-fade-up">
            <Gift size={14} /> First one today is FREE!
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-3">Target Role</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {ROLES.map(({ label, icon: Icon }) => (
              <button key={label} type="button" onClick={() => setRole(label)}
                className={`flex flex-col items-start gap-2 p-3 rounded-xl border text-left text-xs font-semibold transition-all ${role === label ? 'border-brand bg-brand/10 text-brand' : 'border-bdr2 bg-deep text-muted hover:border-brand/50'}`}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-3">Seniority Level</label>
          <div className="grid grid-cols-3 gap-2.5">
            {LEVELS.map(({ label, bars }) => (
              <button key={label} type="button" onClick={() => setLevel(label)}
                className={`flex flex-col items-center gap-2 py-3 rounded-xl border text-sm font-bold transition-all ${level === label ? 'border-brand bg-brand/10 text-brand' : 'border-bdr2 bg-deep text-muted hover:border-brand/50'}`}>
                <span className="flex gap-1">
                  {[1, 2, 3].map(i => <span key={i} className={`w-1.5 h-4 rounded-full ${i <= bars ? (level === label ? 'bg-brand' : 'bg-muted') : 'bg-bdr2'}`} />)}
                </span>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-bdr2">
          <label className="block text-sm font-bold mb-3">Interview Mode</label>
          <div className="grid sm:grid-cols-2 gap-3">
            {MODES.map(({ label, desc, icon: Icon }) => (
              <button key={label} type="button" onClick={() => setMode(label)}
                className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${mode === label ? 'border-brand bg-brand/10' : 'border-bdr2 bg-deep hover:border-brand/50'}`}>
                <Icon size={18} className={mode === label ? 'text-brand' : 'text-muted'} />
                <span>
                  <span className={`block text-sm font-bold ${mode === label ? 'text-brand' : 'text-txt'}`}>{label}</span>
                  <span className="block text-xs text-muted mt-0.5">{desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 🌟 Dynamic Button Text & Safety Messages */}
        <div className="pt-2">
          <Button onClick={startSession} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <span className="flex items-center justify-center gap-2"><Sparkles size={16} className="animate-pulse" /> Configuring session...</span>
            ) : (
              `Start Interview (${tokenCost} Tokens)`
            )}
          </Button>

          {user?.tokens < tokenCost && !isNewDay && (
            <p className="text-center text-xs text-red-400 font-semibold mt-3 animate-fade-up">
              Not enough tokens. Please claim your daily reward or upgrade your plan.
            </p>
          )}
          
          {user?.tokens < tokenCost && isNewDay && (
            <p className="text-center text-xs text-brand font-semibold mt-3 animate-fade-up">
              Make sure to claim your daily reward from the top navigation bar to get your free tokens!
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SetupPhase;