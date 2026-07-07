import React from 'react';
import { Editor } from '@monaco-editor/react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const CodingRound = ({ 
  questionsCompleted, 
  totalTasks, 
  currentQuestion, 
  codeAnswer, 
  setCodeAnswer, 
  selectedLanguage, 
  setSelectedLanguage, 
  handleCodeSubmit, 
  loading, 
  loadReport 
}) => {

  // Monaco requires a specific onChange signature
  const handleEditorChange = (value) => {
    setCodeAnswer(value);
  };

  return (
    <div className="p-5 md:p-8 animate-fade-up max-w-[1400px] mx-auto min-h-screen flex flex-col">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6 border-b border-bdr pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            💻 Technical Coding Round
          </h2>
          <p className="text-sm text-brand-lt font-semibold mt-1">
            Progress: {questionsCompleted} / {totalTasks} Tasks
          </p>
        </div>
        <button 
          onClick={loadReport} 
          className="text-xs text-red-400 font-bold uppercase tracking-wider border border-red-400/30 hover:bg-red-400/10 px-4 py-2 rounded transition-colors"
        >
          🏁 Finish Early
        </button>
      </div>

      {/* Main Workspace */}
      <div className="grid lg:grid-cols-[1fr_2fr] gap-6 flex-grow">
        
        {/* Left Column: Problem Statement */}
        <Card className="p-6 bg-brand/5 flex flex-col border border-bdr">
          <p className="text-[11px] font-bold text-brand-lt tracking-widest uppercase mb-3">
            Problem Statement
          </p>
          <div className="text-sm text-txt leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-[600px] pr-2">
            {currentQuestion}
          </div>
        </Card>

        {/* Right Column: Code Editor */}
        <Card className="p-0 flex flex-col overflow-hidden border border-bdr">
          
          {/* Editor Header & Controls */}
          <div className="flex justify-between items-center p-4 bg-deep/50 border-b border-bdr2">
            <p className="text-[11px] font-bold text-ghost tracking-widest uppercase">
              Code Editor
            </p>
            <select 
              value={selectedLanguage} 
              onChange={e => setSelectedLanguage(e.target.value)}
              className="bg-deep border border-bdr2 text-xs text-txt py-1.5 px-3 rounded cursor-pointer hover:border-brand-lt transition-colors outline-none focus:ring-1 focus:ring-brand-lt"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
            </select>
          </div>

          {/* Monaco Editor Instance */}
          <div className="flex-grow min-h-[400px]">
            <Editor
              height="100%"
              language={selectedLanguage}
              theme="vs-dark"
              value={codeAnswer}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                wordWrap: "on",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                
                // IntelliSense & Auto-Completion Enablers
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: false
                },
                suggestOnTriggerCharacters: true,
                acceptSuggestionOnEnter: "on",
                tabCompletion: "on",
                wordBasedSuggestions: "allDocuments",
              }}
            />
          </div>

          {/* Footer & Submit */}
          <div className="p-4 bg-deep/50 border-t border-bdr2 flex justify-end">
            <Button 
              onClick={handleCodeSubmit} 
              disabled={loading}
              className={`min-w-[140px] ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin text-lg">⚙️</span> Evaluating...
                </span>
              ) : (
                '🚀 Submit Code'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CodingRound;