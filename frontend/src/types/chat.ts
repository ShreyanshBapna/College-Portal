export type Language = 'en' | 'hi' | 'raj';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language: Language;
  confidence?: number;
  intent?: string;
  entities?: any[];
}

export interface ChatSession {
  sessionId: string;
  language: Language;
  isActive: boolean;
  startTime: Date;
}

export interface ChatResponse {
  success: boolean;
  userMessage: {
    id: string;
    content: string;
    timestamp: Date;
  };
  botResponse: {
    id: string;
    content: string;
    language: Language;
    confidence: number;
    intent: string;
    timestamp: Date;
  };
}

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  language: Language;
  category: string;
  keywords: string[];
}