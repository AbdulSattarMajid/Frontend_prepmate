import { useState, useEffect } from 'react';
import {
  Layout, Server, Database, GitBranch, Box, Terminal, Network, ShieldCheck,
  Smartphone, Cpu, GraduationCap, ChevronLeft, ChevronRight, Check, X,
  RotateCcw, Minus, Plus, Loader2, ArrowRight, AlertCircle
} from 'lucide-react';

import { learningApi } from '../../services/learningApi';

const TOPICS = [
  { id: "frontend", label: "Frontend Development", icon: Layout },
  { id: "backend", label: "Backend Development", icon: Server },
  { id: "databases", label: "Databases (SQL/NoSQL)", icon: Database },
  { id: "dsa", label: "Data Structures & Algorithms", icon: GitBranch },
  { id: "oop", label: "Object-Oriented Programming", icon: Box },
  { id: "pf", label: "Programming Fundamentals", icon: Terminal },
  { id: "networks", label: "Computer Networks", icon: Network },
  { id: "cyber_security", label: "Cyber Security", icon: ShieldCheck },
  { id: "mobile", label: "Mobile App Development", icon: Smartphone },
  { id: "ai", label: "Artificial Intelligence", icon: Cpu },
];

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500;600&display=swap');
    .qz-display { font-family: 'Space Grotesk', sans-serif; }
    .qz-body { font-family: 'Inter', sans-serif; }
    .qz-mono { font-family: 'JetBrains Mono', monospace; }
    @keyframes qzFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .qz-animate-in { animation: qzFadeIn 0.35s ease-out; }
    @keyframes qzPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.45); }
      50% { box-shadow: 0 0 0 5px rgba(59, 130, 246, 0); }
    }
    .qz-dot-current { animation: qzPulse 1.8s ease-in-out infinite; }
  `}</style>
);

const Glow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-32 -right-24 w-80 h-80 rounded-full blur-3xl opacity-10 bg-brand" />
    <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full blur-3xl opacity-5 bg-brand" />
  </div>
);

const LearningModule = () => {
  // --- STATE ---
  const [phase, setPhase] = useState('setup'); // 'setup', 'quiz', 'results'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Setup State
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0].id);
  const [questionCount, setQuestionCount] = useState(10);

  // Quiz State
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});

  // Results State
  const [ringValue, setRingValue] = useState(0);

  const currentTopic = TOPICS.find((t) => t.id === selectedTopic) || TOPICS[0];
  const TopicIcon = currentTopic.icon;

  // --- HANDLERS ---
  const startQuiz = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await learningApi.getQuiz(selectedTopic, questionCount);
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setUserAnswers({});
        setPhase('quiz');
      } else {
        setErrorMessage('No questions found for this track. Try a different one.');
      }
    } catch (error) {
      setErrorMessage('Could not reach the quiz service. Check your backend and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (option) => {
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: option }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setPhase('results');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const restart = () => {
    setPhase('setup');
    setQuestions([]);
    setUserAnswers({});
    setCurrentIndex(0);
    setRingValue(0);
  };

  // --- SCORING ---
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;
  questions.forEach((q, i) => {
    const ua = userAnswers[i];
    if (ua === undefined) skippedCount += 1;
    else if (ua === q.answer) correctCount += 1;
    else incorrectCount += 1;
  });
  const percentage = questions.length
    ? Math.round((correctCount / questions.length) * 100)
    : 0;

  useEffect(() => {
    if (phase === 'results') {
      setRingValue(0);
      const t = setTimeout(() => setRingValue(percentage), 80);
      return () => clearTimeout(t);
    }
  }, [phase, percentage]);

  const RADIUS = 70;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const ringOffset = CIRCUMFERENCE - (ringValue / 100) * CIRCUMFERENCE;
  const ringColor = percentage >= 70 ? '#22C55E' : percentage >= 40 ? '#EAB308' : '#EF4444';

  // --- RENDER: SETUP ---
  if (phase === 'setup') {
    return (
      <div className="min-h-screen p-4 md:p-8 qz-body flex items-center justify-center relative bg-deep transition-colors duration-300">
        <GlobalStyles />
        <Glow />
        <div className="max-w-2xl w-full rounded-3xl border border-bdr shadow-2xl space-y-8 p-8 relative z-10 bg-card transition-colors duration-300">
          <div className="text-center">
            <div className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand/20">
              <GraduationCap size={26} className="text-brand-lt" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-txt qz-display transition-colors duration-300">Knowledge Assessment</h1>
            <p className="text-muted mt-2 text-sm transition-colors duration-300">Pick a track and a length, then test what you know.</p>
          </div>

          <div className="space-y-6">
            <div>
              <span className="block text-xs font-bold text-muted uppercase tracking-wider mb-3 qz-mono transition-colors duration-300">Choose a track</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {TOPICS.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedTopic === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTopic(t.id)}
                      className={`flex flex-col items-start gap-2.5 p-3.5 rounded-xl border text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                        isSelected
                          ? 'border-brand-lt bg-brand/10 text-brand-lt'
                          : 'bg-card2 border-bdr text-muted hover:border-bdr2 hover:text-txt'
                      }`}
                    >
                      <Icon size={18} strokeWidth={2} className={isSelected ? 'text-brand-lt' : 'text-ghost'} />
                      <span className="text-xs font-semibold leading-tight">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-muted uppercase tracking-wider qz-mono transition-colors duration-300">Questions</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuestionCount((q) => Math.max(1, Number(q) - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-bdr2 text-muted hover:border-brand-lt hover:text-brand-lt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qz-mono text-lg font-semibold text-txt w-8 text-center transition-colors duration-300">{questionCount}</span>
                  <button
                    type="button"
                    onClick={() => setQuestionCount((q) => Math.min(50, Number(q) + 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-bdr2 text-muted hover:border-brand-lt hover:text-brand-lt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full accent-brand-lt cursor-pointer"
              />
            </div>

            {errorMessage && (
              <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-500 text-sm">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="button"
              onClick={startQuiz}
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex justify-center items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                loading
                  ? 'bg-bdr text-muted cursor-not-allowed'
                  : 'bg-brand hover:bg-brand-lt text-white shadow-lg shadow-brand/20'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Generating quiz...
                </>
              ) : (
                <>
                  Start assessment
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: QUIZ ---
  if (phase === 'quiz') {
    const currentQ = questions[currentIndex];
    const hasAnswered = userAnswers[currentIndex] !== undefined;

    return (
      <div className="min-h-screen p-4 md:p-8 qz-body flex flex-col items-center relative bg-deep transition-colors duration-300">
        <GlobalStyles />
        <Glow />
        <div className="max-w-3xl w-full space-y-6 mt-8 relative z-10">

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted transition-colors duration-300">
              <TopicIcon size={16} />
              <span className="text-sm font-semibold">{currentTopic.label}</span>
            </div>
            <span className="qz-mono text-sm text-muted transition-colors duration-300">
              <span className="text-brand-lt font-semibold">{currentIndex + 1}</span> / {questions.length}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {questions.map((_, i) => {
              const answered = userAnswers[i] !== undefined;
              const isCurrent = i === currentIndex;
              return (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'w-7 bg-brand-lt qz-dot-current'
                      : answered
                      ? 'w-2 bg-brand-lt'
                      : 'w-2 bg-bdr2'
                  }`}
                />
              );
            })}
          </div>

          <div key={currentIndex} className="qz-animate-in rounded-3xl border border-bdr shadow-2xl p-6 md:p-10 bg-card transition-colors duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-txt mb-8 leading-relaxed qz-display transition-colors duration-300">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentIndex] === option;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAnswer(option)}
                    className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl border-2 transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      isSelected
                        ? 'bg-brand/10 border-brand-lt text-brand-lt'
                        : 'bg-card2 border-bdr text-muted hover:border-bdr2 hover:text-txt'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center qz-mono text-sm font-semibold border transition-colors duration-300 ${
                        isSelected ? 'border-brand-lt bg-brand text-white' : 'border-bdr2 text-ghost'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  currentIndex === 0
                    ? 'text-ghost cursor-not-allowed'
                    : 'text-muted hover:bg-card2 hover:text-txt'
                }`}
              >
                <ChevronLeft size={18} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={!hasAnswered}
                className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  hasAnswered
                    ? 'bg-brand hover:bg-brand-lt text-white'
                    : 'bg-bdr text-muted cursor-not-allowed'
                }`}
              >
                {currentIndex === questions.length - 1 ? 'Finish quiz' : 'Next question'}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER: RESULTS ---
  return (
    <div className="min-h-screen p-4 md:p-8 qz-body relative bg-deep transition-colors duration-300">
      <GlobalStyles />
      <Glow />
      <div className="max-w-4xl mx-auto space-y-6 mt-8 relative z-10">

        <div className="rounded-3xl border border-bdr shadow-2xl text-center p-8 md:p-10 bg-card transition-colors duration-300">
          <h1 className="text-3xl font-bold text-txt mb-1 qz-display transition-colors duration-300">Assessment complete</h1>
          <div className="flex items-center justify-center gap-2 text-muted mb-8 transition-colors duration-300">
            <TopicIcon size={16} />
            <p className="text-sm">{currentTopic.label}</p>
          </div>

          <div className="relative w-44 h-44 mx-auto">
            <svg width="176" height="176" viewBox="0 0 176 176" className="-rotate-90">
              {/* Used var(--color-bdr) for the background ring color so it adapts to Light/Dark mode */}
              <circle cx="88" cy="88" r={RADIUS} fill="none" stroke="var(--color-bdr)" strokeWidth="12" className="transition-colors duration-300" />
              <circle
                cx="88" cy="88" r={RADIUS} fill="none"
                stroke={ringColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={ringOffset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="qz-mono text-4xl font-bold text-txt transition-colors duration-300">{percentage}%</span>
              <span className="text-xs font-bold text-muted uppercase mt-1 transition-colors duration-300">{correctCount} / {questions.length} correct</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-8 max-w-md mx-auto">
            <div className="rounded-xl border border-bdr py-3 bg-card2 transition-colors duration-300">
              <div className="qz-mono text-xl font-bold text-green-500">{correctCount}</div>
              <div className="text-xs font-bold text-muted uppercase tracking-wider mt-1 transition-colors duration-300">Correct</div>
            </div>
            <div className="rounded-xl border border-bdr py-3 bg-card2 transition-colors duration-300">
              <div className="qz-mono text-xl font-bold text-red-500">{incorrectCount}</div>
              <div className="text-xs font-bold text-muted uppercase tracking-wider mt-1 transition-colors duration-300">Incorrect</div>
            </div>
            <div className="rounded-xl border border-bdr py-3 bg-card2 transition-colors duration-300">
              <div className="qz-mono text-xl font-bold text-muted transition-colors duration-300">{skippedCount}</div>
              <div className="text-xs font-bold text-muted uppercase tracking-wider mt-1 transition-colors duration-300">Skipped</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-txt qz-display px-1 transition-colors duration-300">Review your answers</h2>
          {questions.map((q, i) => {
            const userAnswer = userAnswers[i];
            const isCorrect = userAnswer === q.answer;
            const isSkipped = userAnswer === undefined;
            const userLetter = userAnswer !== undefined ? String.fromCharCode(65 + q.options.indexOf(userAnswer)) : null;
            const correctLetter = String.fromCharCode(65 + q.options.indexOf(q.answer));

            return (
              <div
                key={i}
                className={`p-5 md:p-6 rounded-xl border transition-colors duration-300 ${
                  isCorrect 
                    ? 'border-green-500/30 bg-green-500/10' 
                    : isSkipped 
                    ? 'border-bdr bg-card2' 
                    : 'border-red-500/30 bg-red-500/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                    isCorrect ? 'bg-green-500/20 text-green-500' : isSkipped ? 'bg-bdr text-muted' : 'bg-red-500/20 text-red-500'
                  }`}>
                    {isCorrect ? <Check size={14} /> : isSkipped ? <span className="text-xs qz-mono">–</span> : <X size={14} />}
                  </div>
                  <p className="font-semibold text-txt leading-relaxed transition-colors duration-300">{i + 1}. {q.question}</p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mt-4 pl-9 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted font-bold uppercase text-xs qz-mono transition-colors duration-300">Your answer</span>
                    {isSkipped ? (
                      <span className="text-muted transition-colors duration-300">Skipped</span>
                    ) : (
                      <span className={`flex items-center gap-2 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                        <span className="qz-mono font-bold">{userLetter}</span>
                        {userAnswer}
                      </span>
                    )}
                  </div>
                  {!isCorrect && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted font-bold uppercase text-xs qz-mono transition-colors duration-300">Correct answer</span>
                      <span className="flex items-center gap-2 text-green-500">
                        <span className="qz-mono font-bold">{correctLetter}</span>
                        {q.answer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={restart}
          className="w-full py-4 rounded-xl font-bold bg-card border border-bdr text-txt transition-colors flex items-center justify-center gap-2 hover:bg-card2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
        >
          <RotateCcw size={18} />
          Start another assessment
        </button>
      </div>
    </div>
  );
};

export default LearningModule;