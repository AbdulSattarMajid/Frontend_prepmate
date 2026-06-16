import { useState, useEffect } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { interviewApi } from '../../../services/interviewApi';
import { Code2, Server, Layout, Database, Braces, Boxes, ListChecks, Sparkles } from 'lucide-react';

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
  const [aiReady, setAiReady] = useState(false);

  // Silently warms up Ollama while the user reads the screen.
  useEffect(() => {
    interviewApi.wakeUpAI().then(() => setAiReady(true)).catch(() => {});
  }, []);

  return (
    <div className="p-5 md:p-8 animate-fade-up max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl md:text-3xl font-black">Candidate Registration</h1>
        <span className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border border-bdr2 whitespace-nowrap ${aiReady ? 'text-brand' : 'text-muted'}`}>
          <span className={`w-2 h-2 rounded-full ${aiReady ? 'bg-brand' : 'bg-muted animate-pulse'}`} />
          {aiReady ? 'AI engine ready' : 'Warming up AI engine'}
        </span>
      </div>
      <p className="text-muted mb-8">Customize your AI interview environment.</p>

      <Card className="p-6 space-y-6">
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

        <Button onClick={startSession} disabled={loading} className="w-full mt-4" size="lg">
          {loading ? <span className="flex items-center justify-center gap-2"><Sparkles size={16} className="animate-pulse" /> Configuring session...</span> : 'Start Interview'}
        </Button>
      </Card>
    </div>
  );
};

export default SetupPhase;