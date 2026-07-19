import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { interviewApi } from '../../services/interviewApi';

import SetupPhase from './phases/SetupPhase';
import VoiceRound from './phases/VoiceRound';
import CodingRound from './phases/CodingRound';
import ReportPhase from './phases/ReportPhase';
import Button from '../../components/ui/Button'; 

const LLM_ROLES = ["MERN Stack", "Frontend (React)", "Python Backend", "MySQL / Databases"];

const InterviewPage = ({ onNav }) => {
  // 🌟 PULL IN deductTokens FROM CONTEXT
  const { user, deductTokens } = useApp();
  
  // --- CORE STATE ---
  const [phase, setPhase] = useState('setup');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('Frontend (React)');
  const [level, setLevel] = useState('Junior');
  const [mode, setMode] = useState('Full Interview');
  
  // --- INTERVIEW DATA STATE ---
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [qType, setQType] = useState('behavioral');
  const [totalTasks, setTotalTasks] = useState(9);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [expectedPoints, setExpectedPoints] = useState([]);
  
  // --- CODING STATE ---
  const [startingCode, setStartingCode] = useState('');
  const [codingTests, setCodingTests] = useState([]);
  const [entryPoints, setEntryPoints] = useState({});
  const [codeAnswer, setCodeAnswer] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  // --- HARDWARE / VOICE STATE ---
  const [seconds, setSeconds] = useState(0);
  const [recording, setRec] = useState(false);
  const [camActive, setCamActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  
  // --- REFS ---
  const timerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);

  // --- FRAME CAPTURE STATE ---
  const [capturedFrames, setCapturedFrames] = useState([]);
  const frameIntervalRef = useRef(null);
  const capturedFramesRef = useRef([]);

  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    let mounted = true;

    const checkExistingSession = async () => {
      if (localStorage.getItem('prepmate_evaluating') === 'true') {
        setPhase('finalizing'); 
        try {
          const data = await interviewApi.getReport();
          if (mounted) {
            if (data && data.summary && data.summary.overall_score !== undefined) {
              localStorage.removeItem('prepmate_evaluating');
              setReportData(data);
              setPhase('report');
            } else if (data?.summary?.evaluation_status === 'processing') {
              loadReport();
            } else {
              localStorage.removeItem('prepmate_evaluating');
              setPhase('setup');
            }
          }
        } catch (err) {
          if (mounted) {
            localStorage.removeItem('prepmate_evaluating');
            setPhase('setup');
          }
        }
      }
    };

    checkExistingSession();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- NATIVE VOICE UTIL ---
  const speakText = (text) => {
    window.speechSynthesis.cancel();
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.includes('en-US') || v.lang.includes('en-GB'));
    if (englishVoice) utterance.voice = englishVoice;
    window.speechSynthesis.speak(utterance);
  };

  // --- CAMERA UTILS ---
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      } else {
        setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable.");
      setCamActive(false);
    }
  };

  const stopCamera = () => {
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  const captureFrame = () => {
    if (videoRef.current && camActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth / 2; 
      canvas.height = videoRef.current.videoHeight / 2;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const base64Image = canvas.toDataURL('image/jpeg', 0.6);
      setCapturedFrames(prev => [...prev, base64Image]);
    }
  };

  // --- API HANDLERS ---
  const loadReport = async () => {
    setLoading(true);
    window.speechSynthesis.cancel();
    stopCamera();
    
    localStorage.setItem('prepmate_evaluating', 'true');
    setPhase('finalizing'); 
    
    try {
      let data = await interviewApi.getReport();
      while (data?.summary?.evaluation_status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 3000)); 
        data = await interviewApi.getReport(); 
      }

      localStorage.removeItem('prepmate_evaluating');
      setReportData(data);
      setPhase('report');
    } catch (err) {
      localStorage.removeItem('prepmate_evaluating');
      alert("Failed to fetch report data. Please check your dashboard later.");
      setPhase('setup'); 
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async (currentIndex = questionsCompleted, currentMode = mode) => {
    setLoading(true);
    const limit = currentMode === "Coding Challenge Only" ? 5 : 9;
    setTotalTasks(limit);

    if (currentIndex >= limit) {
      await loadReport();
      return;
    }

    let nextQType = 'behavioral';
    const codingType = LLM_ROLES.includes(role) ? "theoretical_code" : "coding";
    if (currentMode === "Coding Challenge Only") nextQType = codingType;
    else {
      if (currentIndex < 2) nextQType = "behavioral";
      else if (currentIndex < 4) nextQType = "theoretical";
      else nextQType = codingType;
    }

    setQType(nextQType);

    try {
      const data = await interviewApi.generateQuestion(user?.name || "Candidate", role, level, nextQType, currentIndex);
      setCurrentQuestion(data.question);
      setExpectedPoints(data.expected_points || []);
      
      if (nextQType === "theoretical_code" || nextQType === "coding") {
        setStartingCode(data.starting_code || '');
        setCodingTests(data.tests || []);
        setEntryPoints(data.entry_points || {});
        stopCamera();
        if (nextQType === "coding") {
          const isJS = role.includes('React') || role.includes('MERN') || role === 'JavaScript';
          setSelectedLanguage(isJS ? 'javascript' : 'python');
          const funcName = data.entry_points?.[isJS ? 'JavaScript' : 'Python'] || 'solution';
          setStartingCode(isJS ? `function ${funcName}() {\n  // Write your code here\n}` : `def ${funcName}():\n    pass`);
        }
        setCodeAnswer(data.starting_code || startingCode);
        setPhase('coding_round');
        speakText("Please review the coding challenge on your screen.");
      } else {
        setSeconds(0);
        setPhase('voice_round');
        initCamera(); 
        speakText(data.question);
      }
    } catch (err) {
      alert("Error fetching question from backend.");
    } finally {
      setLoading(false);
    }
  };

  const startSession = async () => {
    // 1. Determine cost based on mode
    const tokenCost = mode === "Coding Challenge Only" ? 10 : 20;

    // 2. Front-end guard
    if (user.tokens < tokenCost) {
      alert(`You need ${tokenCost} tokens to start a ${mode}. You currently have ${user.tokens}.`);
      return;
    }

    setLoading(true);

    // 3. Process Payment
    const deductResult = await deductTokens(tokenCost);
    if (!deductResult.success) {
      alert(deductResult.message || "Failed to process tokens. Please try again.");
      setLoading(false);
      return;
    }

    // 4. Payment successful! Start the interview.
    localStorage.removeItem('prepmate_evaluating');
    
    try {
      const testStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      testStream.getTracks().forEach(track => track.stop());
    } catch (err) {
      alert("⚠️ Camera or Microphone access is blocked!\n\nPlease click the Padlock icon 🔒 in your browser's address bar, change Camera and Microphone to 'Allow', and refresh the page.");
      setLoading(false);
      return; 
    }
    
    if (interviewApi.wakeUpAI) interviewApi.wakeUpAI();
    await interviewApi.resetSession();
    setQuestionsCompleted(0);
    handleNextQuestion(0, mode);
  };

  const startRec = async () => {
    try {
      window.speechSynthesis.cancel();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        audioChunksRef.current = [];
        await handleVoiceSubmit(audioBlob, capturedFramesRef.current);
      };
      
      mediaRecorderRef.current.start();
      setRec(true);
      
      setCapturedFrames([]); 
      capturedFramesRef.current = []; 
      
      frameIntervalRef.current = setInterval(() => {
        if (videoRef.current && camActive) {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth / 2; 
          canvas.height = videoRef.current.videoHeight / 2;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const base64Image = canvas.toDataURL('image/jpeg', 0.6);
          
          setCapturedFrames(prev => [...prev, base64Image]);
          capturedFramesRef.current.push(base64Image); 
        }
      }, 3000); 

      timerRef.current = setInterval(() => setSeconds(s => s+1), 1000);
    } catch (err) {
      alert("Microphone access required.");
    }
  };

  const stopRec = () => {
    setRec(false);
    clearInterval(timerRef.current);
    clearInterval(frameIntervalRef.current); 
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      setLoading(true);
      mediaRecorderRef.current.stop();
    }
  };

  const handleVoiceSubmit = async (audioBlob, finalFrames) => {
    try {
      await interviewApi.processVoiceAnswer(
        audioBlob, finalFrames, currentQuestion, role, level, expectedPoints, qType, questionsCompleted
      );
      
      const nextIndex = questionsCompleted + 1;
      setQuestionsCompleted(nextIndex);
      handleNextQuestion(nextIndex); 
    } catch (err) {
      alert("Failed to process audio.");
      setLoading(false);
    }
  };

  const handleCodeSubmit = async () => {
    if (!codeAnswer.trim()) return;
    setLoading(true);
    try {
      const langKey = selectedLanguage === "javascript" ? "JavaScript" : "Python";
      let functionName = entryPoints[langKey] || "solution";

      if (selectedLanguage === "python") {
        const pyMatch = codeAnswer.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
        if (pyMatch) functionName = pyMatch[1];
      } else {
        const jsMatch = codeAnswer.match(/function\s+([a-zA-Z_][a-zA-Z0-9_]*)/) || 
                        codeAnswer.match(/(?:const|let|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(?:function|\()/);
        if (jsMatch) functionName = jsMatch[1];
      }

      if (qType === "theoretical_code" || !codingTests || codingTests.length === 0) {
        await interviewApi.processTextAnswer({
          question: currentQuestion, 
          answer_text: codeAnswer, 
          role, 
          level,
          expected_points: Array.isArray(expectedPoints) ? expectedPoints.join('\n') : expectedPoints,
          q_type: "theoretical_code",
          question_index: questionsCompleted 
        });
      } else {
        await interviewApi.evaluateCode({
          code: codeAnswer, 
          tests: codingTests, 
          function_name: functionName, 
          language: selectedLanguage,
          question_index: questionsCompleted 
        });
      }
      
      const nextIndex = questionsCompleted + 1;
      setQuestionsCompleted(nextIndex);
      handleNextQuestion(nextIndex); 
    } catch (err) {
      alert("Evaluation failed. Your backend sandbox may have crashed due to a syntax error.");
      setLoading(false);
    }
  };

  // --- RENDER ROUTER ---
  switch (phase) {
    case 'setup':
      return <SetupPhase role={role} setRole={setRole} level={level} setLevel={setLevel} mode={mode} setMode={setMode} startSession={startSession} loading={loading} />;
    case 'voice_round':
      return <VoiceRound role={role} questionsCompleted={questionsCompleted} totalTasks={totalTasks} qType={qType} currentQuestion={currentQuestion} recording={recording} seconds={seconds} camActive={camActive} setCamActive={setCamActive} micActive={micActive} setMicActive={setMicActive} startRec={startRec} stopRec={stopRec} loading={loading} videoRef={videoRef} loadReport={loadReport} />;
    case 'coding_round':
      return <CodingRound questionsCompleted={questionsCompleted} totalTasks={totalTasks} currentQuestion={currentQuestion} codeAnswer={codeAnswer} setCodeAnswer={setCodeAnswer} selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} handleCodeSubmit={handleCodeSubmit} loading={loading} loadReport={loadReport} />;
    
    case 'finalizing':
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 transition-colors duration-300 animate-fade-up">
           <div className="w-16 h-16 border-4 border-brand-lt border-t-transparent rounded-full animate-spin transition-colors duration-300"></div>
           <h2 className="text-3xl font-bold text-txt transition-colors duration-300">Finalizing Evaluation...</h2>
           <p className="text-muted max-w-md transition-colors duration-300 mb-4">
             Our AI is finishing up the analysis. This can take a few minutes. 
             You can safely leave this page and check back later!
           </p>
           
           <Button variant="secondary" onClick={() => onNav('dashboard')}>
             Return to Dashboard
           </Button>
        </div>
      );
      
    case 'report':
      return <ReportPhase reportData={reportData} setPhase={setPhase} setReportData={setReportData} onNav={onNav} />;
    default:
      return null;
  }
};

export default InterviewPage;