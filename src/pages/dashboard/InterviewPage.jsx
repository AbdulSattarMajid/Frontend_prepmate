import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { interviewApi } from '../../services/interviewApi';

import SetupPhase from './phases/SetupPhase';
import VoiceRound from './phases/VoiceRound';
import CodingRound from './phases/CodingRound';
import ReportPhase from './phases/ReportPhase';

const LLM_ROLES = ["MERN Stack", "Frontend (React)", "Python Backend", "MySQL / Databases"];

const InterviewPage = ({ onNav }) => {
  const { user } = useApp();
  
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
  
  // 🌟 UPDATED: The Polling Engine for the final report
  const loadReport = async () => {
    setLoading(true);
    window.speechSynthesis.cancel();
    stopCamera();
    
    try {
      let data = await interviewApi.getReport();

      // THE POLLING LOOP: If the AI is still chewing on the last few questions in the background...
      while (data?.summary?.evaluation_status === 'processing') {
        setPhase('finalizing'); 
        
        // Wait 3 seconds, then ping the backend again
        await new Promise(resolve => setTimeout(resolve, 3000)); 
        data = await interviewApi.getReport(); 
      }

      setReportData(data);
      setPhase('report');
    } catch (err) {
      alert("Failed to fetch report data.");
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
    setLoading(true);
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

  // 🌟 UPDATED: Instantly moves to the next question while AI works in the background
  const handleVoiceSubmit = async (audioBlob, finalFrames) => {
    try {
      // Passes questionsCompleted as the questionIndex
      await interviewApi.processVoiceAnswer(
        audioBlob, finalFrames, currentQuestion, role, level, expectedPoints, qType, questionsCompleted
      );
      
      const nextIndex = questionsCompleted + 1;
      setQuestionsCompleted(nextIndex);
      handleNextQuestion(nextIndex); // Instantly trigger the next question
    } catch (err) {
      alert("Failed to process audio.");
      setLoading(false);
    }
  };

  // 🌟 UPDATED: Now injects the question_index into the payload for async tracking
  const handleCodeSubmit = async () => {
    if (!codeAnswer.trim()) return;
    setLoading(true);
    try {
      if (qType === "theoretical_code") {
        await interviewApi.processTextAnswer({
          question: currentQuestion, 
          answer_text: codeAnswer, 
          role, 
          level,
          expected_points: Array.isArray(expectedPoints) ? expectedPoints.join('\n') : expectedPoints,
          q_type: "theoretical_code",
          question_index: questionsCompleted // NEW
        });
      } else {
        const langKey = selectedLanguage === "javascript" ? "JavaScript" : "Python";
        await interviewApi.evaluateCode({
          code: codeAnswer, 
          tests: codingTests, 
          function_name: entryPoints[langKey] || "solution", 
          language: selectedLanguage,
          question_index: questionsCompleted // NEW
        });
      }
      
      const nextIndex = questionsCompleted + 1;
      setQuestionsCompleted(nextIndex);
      handleNextQuestion(nextIndex); // Instantly trigger the next question
    } catch (err) {
      alert("Evaluation failed.");
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
    
    // 🌟 NEW: The holding screen while Llama finishes the background queue
    case 'finalizing':
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 transition-colors duration-300">
           <div className="w-16 h-16 border-4 border-brand-lt border-t-transparent rounded-full animate-spin transition-colors duration-300"></div>
           <h2 className="text-3xl font-bold text-txt transition-colors duration-300">Finalizing Evaluation...</h2>
           <p className="text-muted max-w-md transition-colors duration-300">Our AI is finishing up the analysis of your latest answers. Your comprehensive report will appear in just a moment.</p>
        </div>
      );
      
    case 'report':
      return <ReportPhase reportData={reportData} setPhase={setPhase} setReportData={setReportData} onNav={onNav} />;
    default:
      return null;
  }
};

export default InterviewPage;