// src/services/resumeApi.js
const RESUME_API_URL =import.meta.env.VITE_RESUME_BASE_URL;

export const resumeApi = {
  analyze: async (file, role, jdText) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);
    formData.append('jd_text', jdText);

    const response = await fetch(`${RESUME_API_URL}/analyze`, {
      method: 'POST',
      body: formData, 
    });

    if (!response.ok) {
      throw new Error('Failed to analyze resume');
    }

    return response.json();
  }
};