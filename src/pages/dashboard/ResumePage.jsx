import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { resumeApi } from '../../services/resumeApi';

const JOB_ROLES = [
  { id: "Backend_Developer", label: "Backend Developer" },
  { id: "Frontend_Developer", label: "Frontend Developer" },
  { id: "Fullstack_Developer", label: "Fullstack Developer" },
  { id: "DevOps_Engineer", label: "DevOps Engineer" },
  { id: "Data_Scientist", label: "Data Scientist" },
  { id: "Mobile_Developer", label: "Mobile Developer" },
  { id: "QA_Engineer", label: "QA Engineer" },
  { id: "Cyber_Security", label: "Cyber Security" },
  { id: "AI_Engineer", label: "AI Engineer" },
  { id: "Data_Engineer", label: "Data Engineer" }
];

const ResumeAnalyzer = () => {
  // 🌟 Bring in the Token System
  const { user, deductTokens } = useApp();
  const ANALYSIS_COST = 10;
  
  // 🌟 Check for free daily reward
  const lastClaim = new Date(user?.lastDailyRewardDate || 0);
  const today = new Date();
  const isNewDay = lastClaim.getDate() !== today.getDate() || 
                   lastClaim.getMonth() !== today.getMonth() || 
                   lastClaim.getFullYear() !== today.getFullYear();

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(''); 
  const [role, setRole] = useState(JOB_ROLES[0].id);
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('prepmate_resume_session');
    if (savedSession) {
      const parsed = JSON.parse(savedSession);
      if (parsed.results) setResults(parsed.results);
      if (parsed.jdText) setJdText(parsed.jdText);
      if (parsed.role) setRole(parsed.role);
      if (parsed.fileName) setFileName(parsed.fileName);
      // Note: We cannot restore the actual 'file' object from localStorage
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleAnalyze = async () => {
    // 🌟 STRICT CHECK: Prevent 422 Errors by ensuring the physical file object exists
    if (!file || !role || !jdText) {
      alert("Please upload a resume file, select a role, and paste a Job Description before analyzing.");
      return;
    }

    if (user.tokens < ANALYSIS_COST) {
      alert(`You need ${ANALYSIS_COST} tokens to analyze a resume. You currently have ${user.tokens}.`);
      return;
    }

    setLoading(true);

    try {
      const data = await resumeApi.analyze(file, role, jdText);

      const deductResult = await deductTokens(ANALYSIS_COST);
      if (!deductResult.success) {
        alert(deductResult.message || "Analysis succeeded, but failed to sync token balance.");
      }

      // 🌟 4. Show results
      setResults(data.results);
      
      localStorage.setItem('prepmate_resume_session', JSON.stringify({
        results: data.results,
        jdText: jdText,
        role: role,
        fileName: file.name
      }));

    } catch (error) {
      console.error("422 Details:", error.response?.data || error.message);
      alert("Analysis failed. Your tokens were NOT deducted. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('prepmate_resume_session');
    setResults(null);
    setFile(null);
    setFileName('');
    setJdText('');
    setRole(JOB_ROLES[0].id);
  };

  const handleDownloadPDF = () => {
    if (!results?.pdf_report) return;
    const linkSource = `data:application/pdf;base64,${results.pdf_report}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = `PrepMate_Resume_Report_${role}.pdf`;
    downloadLink.click();
  };

  return (
    <div className="min-h-screen bg-deep text-txt p-4 md:p-8 font-sans transition-colors duration-300">
      
      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-txt transition-colors duration-300">Resume Analyzer</h1>
          <p className="text-muted mt-2 text-sm transition-colors duration-300">Optimize your CV for Applicant Tracking Systems (ATS) and get feedback.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* 🌟 Token Balance Badge */}
          <span className="flex items-center gap-1.5 text-sm font-bold bg-card border border-brand/30 px-3 py-1.5 rounded-full text-brand-lt shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
            {user?.tokens || 0} Tokens
          </span>

          {results && (
            <div className="flex gap-3">
              <button 
                onClick={handleClear}
                className="px-4 py-2.5 bg-bdr transition-colors duration-150 text-txt hover:bg-bdr2 text-sm font-bold rounded-lg border border-bdr2"
              >
                Start Fresh
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand hover:bg-brand-lt text-white text-sm font-bold rounded-lg transition-colors shadow-lg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Report
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANE: CONTROLS */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Document Upload Card */}
          <div className="bg-card rounded-2xl border border-bdr overflow-hidden flex flex-col transition-colors duration-300">
            <div className="p-4 border-b border-bdr bg-sidebar flex items-center justify-between transition-colors duration-300">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center text-red-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-txt truncate transition-colors duration-300">{fileName || 'No file selected'}</p>
                  <p className="text-[11px] text-muted transition-colors duration-300">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF or DOCX'}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-card2 flex-1 flex flex-col items-center justify-center min-h-[250px] relative transition-colors duration-300">
              {!fileName ? (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-bdr2 flex items-center justify-center mx-auto text-muted transition-colors duration-300">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  </div>
                  <p className="text-sm text-muted font-medium transition-colors duration-300">Drag & drop or click to browse</p>
                </div>
              ) : (
                <div className="w-3/4 aspect-[1/1.4] bg-white rounded shadow-sm opacity-10 p-4 space-y-3">
                  <div className="h-2 bg-black rounded w-1/3"></div>
                  <div className="h-1 bg-black rounded w-full"></div>
                  <div className="h-1 bg-black rounded w-5/6"></div>
                  <div className="h-1 bg-black rounded w-full"></div>
                </div>
              )}
              
              <input 
                type="file" 
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Target Job Description Card */}
          <div className="bg-card rounded-2xl border border-bdr p-5 relative overflow-hidden transition-colors duration-300">
            {/* 🌟 The Free Badge */}
            {isNewDay && (
              <div className="absolute top-0 right-0 bg-brand text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                First one today is FREE!
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
              <h3 className="font-bold text-txt text-sm transition-colors duration-300">Target Job Description</h3>
            </div>

            <div className="space-y-4">
              <div>
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-card2 border border-bdr2 rounded-lg px-3 py-2.5 text-sm text-txt focus:outline-none focus:border-brand cursor-pointer transition-colors duration-300"
                >
                  {JOB_ROLES.map((job) => (
                    <option key={job.id} value={job.id}>{job.label}</option>
                  ))}
                </select>
              </div>

              <textarea 
                rows="6"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the job requirements here..."
                className="w-full bg-card2 border border-bdr2 rounded-lg px-4 py-3 text-sm text-txt focus:outline-none focus:border-brand resize-none placeholder:text-ghost transition-colors duration-300"
              />

              <div>
                <button 
                  onClick={handleAnalyze}
                  // 🌟 STRICT CHECK: Button is disabled if there's no file or jd text
                  disabled={loading || !file || !jdText}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex justify-center items-center gap-2 ${
                    loading || !file || !jdText ? "bg-bdr text-muted cursor-not-allowed" : "bg-brand hover:bg-brand-lt text-white"
                  }`}
                >
                  {loading ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>Analyzing...</>
                  ) : (
                    `Compare Resume (${ANALYSIS_COST} Tokens)`
                  )}
                </button>

                {/* 🌟 Safety Warning text */}
                {user?.tokens < ANALYSIS_COST && !isNewDay && (
                  <p className="text-center text-[11px] text-red-400 font-semibold mt-2">
                    Not enough tokens to analyze.
                  </p>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANE: RESULTS */}
        <div className="lg:col-span-8">
          {!results && !loading ? (
            <div className="h-full min-h-[500px] border-2 border-dashed border-bdr rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-card/50 transition-colors duration-300">
              <div className="w-16 h-16 bg-bdr2 rounded-full flex items-center justify-center mb-4 text-muted transition-colors duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h3 className="text-xl font-bold text-txt mb-2 transition-colors duration-300">Awaiting Document</h3>
              <p className="text-muted text-sm max-w-sm transition-colors duration-300">Upload your resume and provide a job description on the left to generate your ATS analysis report.</p>
            </div>
          ) : loading ? (
             <div className="h-full min-h-[500px] border border-bdr rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-card transition-colors duration-300">
               <div className="w-12 h-12 border-4 border-bdr2 border-t-brand rounded-full animate-spin mb-4"></div>
               <p className="text-muted font-medium animate-pulse transition-colors duration-300">Running ATS extraction</p>
             </div>
          ) : (
            <div className="space-y-6 animate-fade-in-up">
              
              {/* ATS Score Card */}
              <div className="bg-card rounded-2xl border border-bdr p-6 md:p-8 transition-colors duration-300">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-brand" stroke="currentColor" strokeWidth="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                      <h2 className="text-sm font-bold text-txt tracking-wide uppercase transition-colors duration-300">ATS Score</h2>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl md:text-6xl font-black tracking-tighter text-txt transition-colors duration-300">{results.score}</span>
                      <span className="text-xl text-muted font-bold transition-colors duration-300">/100</span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="flex-1 max-w-sm w-full">
                    <div className="flex justify-between text-xs text-muted mb-2 font-semibold transition-colors duration-300">
                      <span>Match Rate</span>
                      <span className="text-brand-lt">{results.score}%</span>
                    </div>
                    <div className="w-full bg-bdr2 rounded-full h-3 transition-colors duration-300">
                      <div className={`h-3 rounded-full transition-all duration-1000 ${results.score >= 75 ? 'bg-green-500' : results.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${results.score}%` }}></div>
                    </div>
                  </div>
                </div>

                {/* Sub-Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-bdr transition-colors duration-300">
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 transition-colors duration-300">Experience</p>
                    <p className="text-sm font-semibold text-txt transition-colors duration-300">
                      <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      {results.years_of_experience} Years
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 transition-colors duration-300">Grammar</p>
                    <p className="text-sm font-semibold text-txt transition-colors duration-300">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${results.grammar_issue_count > 0 ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                      {results.grammar_issue_count === 0 ? 'Perfect' : `${results.grammar_issue_count} Issues`}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 transition-colors duration-300">Keywords</p>
                    <p className="text-sm font-semibold text-txt transition-colors duration-300">
                      <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      {results.total_found.length} Found
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1 transition-colors duration-300">Missing</p>
                    <p className="text-sm font-semibold text-txt transition-colors duration-300">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${results.total_missing.length > 0 ? 'bg-red-500' : 'bg-green-500'}`}></span>
                      {results.total_missing.length} Missing
                    </p>
                  </div>
                </div>
              </div>

              {/* Extracted Skills Card */}
              <div className="bg-card rounded-2xl border border-bdr p-6 md:p-8 transition-colors duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-txt text-lg transition-colors duration-300">Extracted Skills</h3>
                  <span className="text-xs text-brand-lt font-medium cursor-pointer hover:underline transition-colors duration-300">Edit Skills</span>
                </div>

                <div className="space-y-6">
                  {Object.entries(results.skills_breakdown).map(([category, data]) => (
                    <div key={category}>
                      <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3 transition-colors duration-300">{category}</h4>
                      <div className="flex flex-wrap gap-2.5">
                        {data.found.map(skill => (
                          <span key={`found-${skill}`} className="px-3.5 py-1.5 text-[13px] font-medium bg-card2 text-txt border border-bdr2 rounded-full transition-colors duration-300">
                            {skill}
                          </span>
                        ))}
                        {data.missing.map(skill => (
                          <span key={`missing-${skill}`} className="px-3.5 py-1.5 text-[13px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 rounded-full flex items-center gap-1.5">
                            {skill}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Suggestions Card */}
              <div className="space-y-4">
                <h3 className="font-bold text-txt text-lg mb-4 transition-colors duration-300">Top Suggestions</h3>
                
                {results.grammar_details && results.grammar_details.length > 0 ? (
                  results.grammar_details.map((err, i) => (
                    <div key={i} className="bg-card rounded-2xl border border-bdr p-5 flex gap-4 transition-colors duration-300">
                      <div className="mt-1 flex-shrink-0 w-8 h-8 rounded bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/><path d="M17 12h.01"/><path d="M7 12h.01"/></svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-txt text-sm transition-colors duration-300">{err.message}</h4>
                          <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">Medium Impact</span>
                        </div>
                        <p className="text-xs text-muted mb-3 leading-relaxed transition-colors duration-300">
                          We noticed a phrasing issue: <span className="italic text-txt transition-colors duration-300">"...{err.context}..."</span>
                        </p>
                        <div className="bg-card2 border border-bdr2 rounded-lg p-3 transition-colors duration-300">
                          <p className="text-xs text-muted transition-colors duration-300">
                            Suggested Fix <span className="mx-2">→</span> <span className="text-green-400 font-medium">{err.suggestion}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-card rounded-2xl border border-green-500/20 p-5 flex gap-4 transition-colors duration-300">
                    <div className="mt-1 flex-shrink-0 w-8 h-8 rounded bg-green-500/10 flex items-center justify-center text-green-500">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-txt text-sm transition-colors duration-300">Formatting is Perfect</h4>
                      </div>
                      <p className="text-xs text-muted leading-relaxed transition-colors duration-300">
                        We didn't find any major grammatical or formatting errors in your document. Great job!
                      </p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzer;