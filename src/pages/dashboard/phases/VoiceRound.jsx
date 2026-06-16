const VoiceRound = ({ 
  role, questionsCompleted, totalTasks, qType, currentQuestion, 
  recording, seconds, camActive, setCamActive, micActive, setMicActive, 
  startRec, stopRec, loading, videoRef, loadReport 
}) => {
  
  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0B0E14] text-white font-sans overflow-hidden">
      <header className="h-20 shrink-0 flex justify-between items-center px-6 md:px-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <span className="font-bold text-xl tracking-wide">PrepMate</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-0.5">{role}</p>
            <p className="text-sm font-bold text-blue-400">Question {questionsCompleted + 1} of {totalTasks}</p>
          </div>
          <button onClick={loadReport} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-700 hover:bg-gray-800 rounded-lg transition-colors text-gray-300">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            End Interview
          </button>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex flex-col items-center justify-center w-full max-w-[1200px] mx-auto px-6 py-4">
        <div className="flex flex-col items-center shrink-0 mb-6 text-center">
          <div className="px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-400 text-[11px] font-bold tracking-wide uppercase mb-5">
            {qType === 'behavioral' ? 'Behavioral Question' : 'Theoretical Question'}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold max-w-4xl leading-snug mb-5 text-gray-100">
            "{currentQuestion}"
          </h1>
          {qType === 'behavioral' && (
            <div className="px-4 py-1.5 rounded-full bg-[#1A1F2B] border border-gray-700/50 text-gray-300 text-xs font-medium flex items-center gap-2">
              <span className="text-yellow-400">💡</span> Tip: Use the STAR method (Situation, Task, Action, Result)
            </div>
          )}
        </div>

        <div className="relative w-full flex-1 max-h-[50vh] min-h-[300px] bg-gradient-to-b from-[#181D2A] to-[#10131B] rounded-[24px] border border-gray-800/80 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
          {recording && (
            <div className="absolute top-5 bg-[#251214] border border-red-500/30 text-gray-300 text-[11px] font-bold px-4 py-1.5 rounded-full flex items-center gap-2 z-20 shadow-lg">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Recording Answer...
            </div>
          )}

          <div className="relative flex flex-col items-center z-10 translate-y-[-10px]">
            <div className={`w-[110px] h-[110px] rounded-full bg-[#0F131D] flex items-center justify-center transition-all duration-300 border border-[#212A40] ${recording ? 'shadow-[0_0_50px_rgba(37,99,235,0.2)]' : ''}`}>
              <div className={`w-[90px] h-[90px] rounded-full flex items-center justify-center border-[2px] bg-[#141A29] transition-all duration-300 ${recording ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)]' : 'border-[#2D3B5A]'}`}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
              </div>
            </div>
            <div className="mt-4 px-3 py-1 bg-[#141822] border border-gray-800 rounded-md text-[9px] font-bold text-gray-400 tracking-[0.2em]">
              AI INTERVIEWER
            </div>
            {recording && (
               <div className="flex items-center justify-center gap-[5px] h-10 mt-5">
                 {Array.from({ length: 7 }).map((_, i) => (
                   <div key={i} className="w-[4px] rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" style={{ height: `${30 + Math.random()*70}%`, animation: `wavebar ${0.4 + (i%3)*0.2}s ease-in-out infinite alternate` }} />
                 ))}
               </div>
            )}
          </div>

          <div className="absolute bottom-5 right-5 w-48 sm:w-60 aspect-[4/3] sm:aspect-video bg-[#0A0C10] rounded-xl border border-gray-700/60 shadow-2xl overflow-hidden group z-20">
            {camActive ? (
              <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover transform -scale-x-100" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs font-semibold">Camera Off</div>
            )}
            <div className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md ${micActive ? 'bg-[#1A1F2B]' : 'bg-red-500/90'}`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={micActive ? "#22C55E" : "white"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </div>
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-black/90 to-transparent flex items-end justify-center pb-2">
              <span className="text-[11px] font-semibold text-gray-200">You</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="shrink-0 w-full px-6 pb-6 pt-2">
        <div className="max-w-[1200px] mx-auto h-[80px] bg-[#141822] border border-gray-800 rounded-[20px] flex items-center justify-between px-6 sm:px-8 shadow-xl">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[9px] font-bold text-gray-500 tracking-widest mb-0.5">TIME ELAPSED</p>
              <p className="text-xl font-mono text-blue-400 font-semibold">{fmtTime(seconds)}</p>
            </div>
            <div className="h-8 border-l border-gray-800" />
            <div className="hidden sm:block">
              <p className="text-[9px] font-bold text-gray-500 tracking-widest mb-0.5">LIMIT</p>
              <p className="text-xl font-mono text-gray-400 font-semibold">03:00</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setMicActive(!micActive)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${micActive ? 'bg-[#1D2433] hover:bg-[#252D3F]' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
            </button>
            <button onClick={() => setCamActive(!camActive)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${camActive ? 'bg-[#1D2433] hover:bg-[#252D3F]' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </button>
          </div>

          {/* 🌟 Dynamic UI States Applied Here */}
          <div>
            {!recording ? (
               <button 
                 onClick={startRec} 
                 disabled={loading} 
                 className={`px-6 py-2.5 font-bold rounded-xl transition-all ${
                   loading 
                     ? "bg-transparent border-2 border-gray-600 text-gray-500 cursor-not-allowed opacity-70" 
                     : "bg-transparent border-2 border-blue-600 hover:bg-blue-600/10 text-blue-400"
                 }`}
               >
                 {loading ? 'Processing...' : 'Start Answering'}
               </button>
            ) : (
               <button 
                 onClick={stopRec} 
                 disabled={loading} 
                 className={`px-6 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 ${
                   loading 
                     ? "bg-gray-600 text-gray-300 cursor-not-allowed opacity-80" 
                     : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                 }`}
               >
                 {loading ? 'Submitting...' : 'Finish Answer'}
                 {!loading && (
                   <span className="w-5 h-5 bg-white text-blue-600 rounded-full flex items-center justify-center ml-1">
                     <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                   </span>
                 )}
               </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default VoiceRound;