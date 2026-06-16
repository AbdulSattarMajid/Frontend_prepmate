// src/services/resumeApi.js
const RESUME_API_URL = 'https://resume-analysis-module.onrender.com';

export const resumeApi = {
  analyze: async (file, role, jdText) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);
    formData.append('jd_text', jdText);

    const response = await fetch(`${RESUME_API_URL}/analyze`, {
      method: 'POST',
      body: formData, // Browser automatically sets the correct multipart boundary
    });

    if (!response.ok) {
      throw new Error('Failed to analyze resume');
    }

    return response.json();
  }
};