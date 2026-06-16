// src/services/learningApi.js

// Using your Azure VM IP. 
// Note: If you eventually host this React app on a secure HTTPS domain (like Vercel), 
// you will need to add an SSL certificate to your Azure backend to prevent "Mixed Content" blocks.
const AZURE_API_URL = 'http://52.184.100.46:8000';

export const learningApi = {
  getQuiz: async (topic, count = 10) => {
    try {
      const response = await fetch(`${AZURE_API_URL}/learning/quiz?topic=${topic}&count=${count}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch quiz');
      }

      return response.json();
    } catch (error) {
      console.error("Quiz Fetch Error:", error);
      throw error;
    }
  }
};