const ReportPhase = ({ reportData, setPhase, setReportData, onNav }) => {
  if (!reportData) return (
    <div className="fixed inset-0 bg-[#0B0E14] flex flex-col items-center justify-center text-gray-400 z-50">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold tracking-widest text-sm uppercase">Loading AI Performance Metrics...</p>
    </div>
  );

  const summary = reportData.summary || {};
  const scores = reportData.scores_out_of_10 || {};
  const history = reportData.detailed_history || {};
  const overall = summary.overall_hireability_score || 0;

  const toneData = history.tone_analysis || [];
  const faceData = history.face_analysis || [];

  const getSafeVal = (dataArr, index, key, defaultVal) => {
    const raw = dataArr[index];
    if (!raw) return defaultVal;
    return typeof raw === 'object' ? (raw[key] || defaultVal) : parseFloat(raw);
  };

  return (
    <div className="fixed inset-0 bg-[#0B0E14] text-white overflow-y-auto z-50">
      <div className="max-w-4xl mx-auto p-6 md:p-10 animate-fade-up">
        <h1 className="text-3xl font-black mb-8 text-center text-gray-100">📊 Comprehensive AI Report</h1>
        
        {/* Top Metrics */}
        <div className="mb-10 rounded-[24px] border border-gray-800 bg-[#141822] p-8 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div><p className="text-[10px] text-gray-500 font-bold tracking-widest mb-1 uppercase">Behavioral</p><p className="text-3xl font-black text-blue-400">{scores.behavioral || 0}<span className="text-lg text-gray-600">/10</span></p></div>
            <div><p className="text-[10px] text-gray-500 font-bold tracking-widest mb-1 uppercase">Theoretical</p><p className="text-3xl font-black text-blue-400">{scores.theoretical || 0}<span className="text-lg text-gray-600">/10</span></p></div>
            <div><p className="text-[10px] text-gray-500 font-bold tracking-widest mb-1 uppercase">Coding</p><p className="text-3xl font-black text-blue-400">{scores.coding || 0}<span className="text-lg text-gray-600">/10</span></p></div>
            <div><p className="text-[10px] text-gray-500 font-bold tracking-widest mb-1 uppercase">Completed</p><p className="text-3xl font-black text-gray-200">{summary.total_questions_answered || 0}</p></div>
          </div>
          <div className={`p-5 rounded-xl text-center font-bold border ${overall >= 7.5 ? 'bg-green-500/10 border-green-500/30 text-green-400' : overall >= 5.0 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {overall >= 7.5 ? '🏆 Recommendation: STRONG HIRE' : overall >= 5.0 ? '⚖️ Recommendation: CONSIDER (Borderline)' : '❌ Recommendation: NOT RECOMMENDED'} 
            <span className="ml-3 bg-black/40 px-3 py-1.5 rounded-lg text-sm">Overall Score: {overall}/10</span>
          </div>
        </div>

        {/* Behavioral */}
        {history.behavioral_results?.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-5 pb-3 border-b border-gray-800 text-gray-200">🤝 Behavioral Breakdown</h3>
            <div className="space-y-4">
              {history.behavioral_results.map((res, i) => {
                const cPts = Number(((res.score / 10.0) * 6.0).toFixed(1));
                const vPts = Number((getSafeVal(toneData, i, 'confidence', 0.8) * 2.0).toFixed(1));
                // FIX: Fallback changed from 10.0 to 0.0
                const fPts = Number(((getSafeVal(faceData, i, 'eye_contact_score', 0.0) / 10.0) * 2.0).toFixed(1));
                const total = (cPts + vPts + fPts).toFixed(1);

                return (
                  <div key={i} className="p-6 bg-[#141822] rounded-2xl border border-gray-800">
                    <p className="font-bold text-lg mb-4 text-gray-200">Question {i + 1} Score: <span className="text-blue-400 ml-1">{total}/10</span></p>
                    <div className="flex flex-wrap gap-3 mb-5 text-[11px] font-bold tracking-wider">
                      <span className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full border border-gray-700">📝 CONTENT: {cPts}/6.0</span>
                      <span className="px-3 py-1.5 bg-blue-900/30 text-blue-400 rounded-full border border-blue-800/50">🎙️ VOICE: {vPts}/2.0</span>
                      <span className="px-3 py-1.5 bg-purple-900/30 text-purple-400 rounded-full border border-purple-800/50">👁️ VISUAL: {fPts}/2.0</span>
                    </div>
                    <p className="text-sm text-gray-400 bg-[#0B0E14] p-4 rounded-xl border border-gray-800 leading-relaxed"><strong className="text-gray-300">💡 AI Feedback:</strong> {res.feedback}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Theoretical */}
        {history.theoretical_results?.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-5 pb-3 border-b border-gray-800 text-gray-200">🧠 Theoretical Breakdown</h3>
            <div className="space-y-4">
              {history.theoretical_results.map((res, j) => {
                const globalIdx = (history.behavioral_results?.length || 0) + j;
                const cPts = Number(((res.score / 10.0) * 8.0).toFixed(1));
                const vPts = Number((getSafeVal(toneData, globalIdx, 'confidence', 0.8) * 1.0).toFixed(1));
                // FIX: Fallback changed from 10.0 to 0.0
                const fPts = Number(((getSafeVal(faceData, globalIdx, 'eye_contact_score', 0.0) / 10.0) * 1.0).toFixed(1));
                const total = (cPts + vPts + fPts).toFixed(1);

                return (
                  <div key={j} className="p-6 bg-[#141822] rounded-2xl border border-gray-800">
                    <p className="font-bold text-lg mb-4 text-gray-200">Question {globalIdx + 1} Score: <span className="text-blue-400 ml-1">{total}/10</span></p>
                    <div className="flex flex-wrap gap-3 mb-5 text-[11px] font-bold tracking-wider">
                      <span className="px-3 py-1.5 bg-gray-800 text-gray-300 rounded-full border border-gray-700">📝 CONTENT: {cPts}/8.0</span>
                      <span className="px-3 py-1.5 bg-blue-900/30 text-blue-400 rounded-full border border-blue-800/50">🎙️ VOICE: {vPts}/1.0</span>
                      <span className="px-3 py-1.5 bg-purple-900/30 text-purple-400 rounded-full border border-purple-800/50">👁️ VISUAL: {fPts}/1.0</span>
                    </div>
                    <p className="text-sm text-gray-400 bg-[#0B0E14] p-4 rounded-xl border border-gray-800 leading-relaxed"><strong className="text-gray-300">💡 AI Feedback:</strong> {res.feedback}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Coding */}
        {history.coding_results?.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xl font-bold mb-5 pb-3 border-b border-gray-800 text-gray-200">💻 Coding Performance</h3>
            <div className="space-y-4">
              {history.coding_results.map((res, i) => {
                const globalIdx = (history.behavioral_results?.length || 0) + (history.theoretical_results?.length || 0) + i;
                let score = res.score || 0;
                let normalizedScore = score > 10 ? (score / 10).toFixed(1) : score;
                let status = "Completed";
                let feedback = "No detailed feedback generated.";

                if (res.error) {
                  status = "Failed (Error)";
                  feedback = `🚨 Crash Detected: ${res.error}`;
                } else if (res.passed_count !== undefined) {
                  status = `Passed ${res.passed_count}/${res.total_count} Tests`;
                  const failedTests = res.test_results?.filter(t => !t.passed) || [];
                  feedback = failedTests.length > 0 
                    ? `❌ Logic Error: Failed on input '${failedTests[0].input}'. Expected '${failedTests[0].expected}', but got '${failedTests[0].actual || failedTests[0].error}'.`
                    : "✅ Perfect! Optimized and passed all edge cases.";
                } else {
                  status = "AI Code Review";
                  feedback = `💡 AI Feedback: ${res.feedback || ''}`;
                }

                return (
                  <div key={i} className={`p-6 rounded-2xl border ${normalizedScore == 10 ? 'border-green-500/30 bg-green-500/5' : normalizedScore > 0 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                    <p className="font-bold text-lg mb-3 text-gray-200">Challenge {globalIdx + 1} Score: <span className="text-white">{normalizedScore}/10</span> <span className="text-sm font-normal text-gray-500 ml-2">({status})</span></p>
                    <p className="text-sm mt-3 text-gray-400">{feedback}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex gap-4 justify-center mt-10 pb-16">
          <button onClick={() => { setPhase('setup'); setReportData(null); }} className="px-6 py-3 rounded-xl bg-[#141822] border border-gray-700 hover:bg-gray-800 text-white font-bold transition-colors">
            🔄 Start New Session
          </button>
          <button onClick={() => onNav('dashboard')} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors shadow-lg shadow-blue-500/20">
            Return to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReportPhase;