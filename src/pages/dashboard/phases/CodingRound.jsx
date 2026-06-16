import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Textarea from '../../../components/ui/Textarea';

const CodingRound = ({ 
  questionsCompleted, totalTasks, currentQuestion, 
  codeAnswer, setCodeAnswer, selectedLanguage, setSelectedLanguage, 
  handleCodeSubmit, loading, loadReport 
}) => {
  return (
    <div className="p-5 md:p-8 animate-fade-up max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-6 border-b border-bdr pb-4">
        <div>
          <h2 className="text-xl font-bold">💻 Technical Coding Round</h2>
          <p className="text-sm text-brand-lt font-semibold mt-1">Progress: {questionsCompleted}/{totalTasks} Tasks</p>
        </div>
        <button onClick={loadReport} className="text-xs text-red-400 font-bold uppercase tracking-wider">
          🏁 Finish Early
        </button>
      </div>
      <div className="grid lg:grid-cols-[1fr_2fr] gap-6">
        <Card className="p-6 bg-brand/5">
          <p className="text-[11px] font-bold text-brand-lt tracking-widest uppercase mb-3">Problem Statement</p>
          <p className="text-sm text-txt leading-relaxed whitespace-pre-wrap">{currentQuestion}</p>
        </Card>
        <Card className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[11px] font-bold text-ghost tracking-widest uppercase">Code Editor</p>
            <select 
              value={selectedLanguage} 
              onChange={e => setSelectedLanguage(e.target.value)}
              className="bg-deep border border-bdr2 text-xs text-txt py-1 px-2 rounded"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
            </select>
          </div>
          <Textarea 
            value={codeAnswer} 
            onChange={setCodeAnswer} 
            rows={18} 
            className="font-mono text-sm bg-[#0d1117] text-gray-300 w-full p-4" 
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleCodeSubmit} disabled={loading}>
              {loading ? 'Evaluating...' : '🚀 Submit Code'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CodingRound;