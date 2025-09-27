import axios from 'axios';
import { ChatSession, ChatResponse, Language } from '../types/chat';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5002';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    throw error;
  }
);

export const chatApi = {
  // Create new chat session
  createSession: async (language: Language = 'en'): Promise<ChatSession> => {
    try {
      const response = await api.post('/chat/session', { language });
      return {
        sessionId: response.data.sessionId,
        language: response.data.language,
        isActive: true,
        startTime: new Date()
      };
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw new Error('Failed to create chat session');
    }
  },

  // Send message
  sendMessage: async (
    sessionId: string, 
    message: string, 
    language: Language = 'en'
  ): Promise<ChatResponse> => {
    try {
      const response = await api.post('/chat/message', {
        sessionId,
        message,
        language
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  },

  // Get chat history
  getChatHistory: async (sessionId: string, page: number = 1, limit: number = 50) => {
    try {
      const response = await api.get(`/chat/history/${sessionId}`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw new Error('Failed to fetch chat history');
    }
  },

  // End chat session
  endSession: async (sessionId: string, feedback?: string, rating?: number) => {
    try {
      const response = await api.put(`/chat/session/${sessionId}/end`, {
        feedback,
        rating
      });
      return response.data;
    } catch (error) {
      console.error('Error ending chat session:', error);
      throw new Error('Failed to end chat session');
    }
  },

  // Get supported languages
  getSupportedLanguages: async () => {
    try {
      const response = await api.get('/chat/languages');
      return response.data.languages;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      throw new Error('Failed to fetch supported languages');
    }
  }
};

export const healthApi = {
  // Check server health
  checkHealth: async () => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw new Error('Server health check failed');
    }
  }
};

export default api;