const AI_BASE_URL = 'http://52.184.100.46:8000'; 

export const interviewApi = {
  resetSession: async () => {
    const res = await fetch(`${AI_BASE_URL}/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset session');
    return res.json();
  },

  // --- WAKE UP PING ---
  wakeUpAI: async () => {
    try {
      // Sending a silent request just to spin up the server and memory
      await fetch(`${AI_BASE_URL}/reset`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      console.log("🧠 Backend and AI awakened!");
    } catch (err) {
      console.warn("Wake up ping failed, but continuing...", err);
    }
  },

  // Generates question dynamically using query parameters
  generateQuestion: async (name, role, level, qType, qIndex) => {
    const res = await fetch(`${AI_BASE_URL}/question/generate?q_type=${qType}&question_index=${qIndex}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, role, level })
    });
    if (!res.ok) throw new Error('Failed to generate question');
    return res.json();
  },

  // Submits Text or Theoretical Code via JSON payload
  processTextAnswer: async (payload) => {
    const res = await fetch(`${AI_BASE_URL}/interview/process-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      // FastAPI Form data usually accepts URL encoded strings when python requests uses data=payload
      body: new URLSearchParams(payload) 
    });
    if (!res.ok) throw new Error('Failed to process text answer');
    return res.json();
  },

  // Submits Voice and context via multipart/form-data
  // 🌟 UPDATED: Now accepts questionIndex at the very end of the parameters!
  processVoiceAnswer: async (audioBlob, frames, question, role, level, expectedPoints, qType, questionIndex) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'answer.wav');
    formData.append('question', question);
    formData.append('role', role);
    formData.append('level', level);
    formData.append('expected_points', Array.isArray(expectedPoints) ? expectedPoints.join('\n') : expectedPoints);
    formData.append('q_type', qType);
    
    // 🌟 NEW: Pass the index to keep out-of-order background evaluations perfectly synced
    formData.append('question_index', questionIndex); 
    
    // Send the frames as a JSON string array of Base64 images
    formData.append('frames', JSON.stringify(frames)); 

    const res = await fetch(`${AI_BASE_URL}/interview/process-voice`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) throw new Error('Failed to process voice answer');
    return res.json();
  },

  // Submits compiler-ready code via JSON
  evaluateCode: async (payload) => {
    const res = await fetch(`${AI_BASE_URL}/coding/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to evaluate code');
    return res.json();
  },

  // Face snapshot analysis
  analyzeFace: async (imageBlob) => {
    const formData = new FormData();
    formData.append('file', imageBlob, 'snapshot.jpg');
    const res = await fetch(`${AI_BASE_URL}/analyze-face`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error('Failed to analyze face');
    return res.json();
  },

  getReport: async () => {
    const res = await fetch(`${AI_BASE_URL}/report`);
    if (!res.ok) throw new Error('Failed to fetch report');
    return res.json();
  }
};