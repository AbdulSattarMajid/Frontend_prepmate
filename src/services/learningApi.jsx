
const AZURE_API_URL = import.meta.env.VITE_AI_BASE_URL ;

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