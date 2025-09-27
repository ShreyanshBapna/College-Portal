import axios from 'axios';
import { logger } from '../utils/logger';

export interface RAGChatResponse {
  message: string;
  language: string;
  confidence: number;
  intent: string;
  entities: string[];
  timestamp: Date;
  source: string;
  ragEnabled: boolean;
}

export interface FlaskChatResponse {
  response: string;
  status: string;
  confidence: number;
  intent: string;
  rag_enabled: boolean;
  language?: string;
}

export class FlaskRAGService {
  private flaskBaseUrl: string;
  private isFlaskAvailable: boolean;

  constructor() {
    this.flaskBaseUrl = process.env.FLASK_RAG_URL || 'http://localhost:5001';
    this.isFlaskAvailable = true;
    this.checkFlaskHealth();
  }

  private async checkFlaskHealth(): Promise<void> {
    try {
      await axios.get(`${this.flaskBaseUrl}/health`, { timeout: 5000 });
      this.isFlaskAvailable = true;
      logger.info('✅ Flask RAG service is available');
    } catch (error) {
      this.isFlaskAvailable = false;
      logger.warn('⚠️ Flask RAG service is not available, falling back to basic chat');
    }
  }

  async sendMessageToRAG(
    userMessage: string,
    userId: string,
    language: string = 'en'
  ): Promise<RAGChatResponse> {
    // Check if Flask service is available
    if (!this.isFlaskAvailable) {
      await this.checkFlaskHealth();
    }

    if (!this.isFlaskAvailable) {
      return this.getFallbackResponse(userMessage, language);
    }

    try {
      logger.info(`Sending message to Flask RAG: "${userMessage}" for user: ${userId}`);
      
      const response = await axios.post<FlaskChatResponse>(
        `${this.flaskBaseUrl}/chat`,
        {
          message: userMessage,
          user_id: userId,
          language: language
        },
        {
          timeout: 15000, // 15 second timeout for RAG processing
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === 'success') {
        return {
          message: response.data.response,
          language: response.data.language || language,
          confidence: response.data.confidence || 85, // Use actual confidence from enhanced chatbot
          intent: response.data.intent || this.extractIntent(userMessage),
          entities: this.extractEntities(userMessage),
          timestamp: new Date(),
          source: response.data.rag_enabled ? 'enhanced_jecrc_chatbot' : 'flask_fallback',
          ragEnabled: response.data.rag_enabled
        };
      } else {
        logger.warn('Flask RAG returned error status:', response.data);
        return this.getFallbackResponse(userMessage, language);
      }

    } catch (error: any) {
      logger.error('Flask RAG service error:', error.message);
      this.isFlaskAvailable = false;
      return this.getFallbackResponse(userMessage, language);
    }
  }

  private getFallbackResponse(userMessage: string, language: string): RAGChatResponse {
    const fallbackMessages = {
      en: "I'm Saarthi, your JECRC chatbot. I'm currently experiencing some technical difficulties with my advanced features, but I'm here to help with basic queries about JECRC Foundation.",
      hi: "मैं सारथी हूं, आपका JECRC चैटबॉट। वर्तमान में मेरी उन्नत सुविधाओं में कुछ तकनीकी कठिनाइयां हैं, लेकिन मैं JECRC Foundation के बारे में बुनियादी प्रश्नों में मदद के लिए यहां हूं।",
      raj: "म्हूं सारथी हूं, थारो JECRC चैटबॉट। अभी म्हारी कुछ तकनीकी समस्या है, पण JECRC Foundation के बारे में सामान्य सवालों में म्हूं मदद कर सकूं हूं।"
    };

    return {
      message: fallbackMessages[language as keyof typeof fallbackMessages] || fallbackMessages.en,
      language: language,
      confidence: 0.5,
      intent: this.extractIntent(userMessage),
      entities: [],
      timestamp: new Date(),
      source: 'express_fallback',
      ragEnabled: false
    };
  }

  private extractIntent(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Academic keywords
    if (/course|syllabus|exam|marks|grade|result|academic|study|subject|class/.test(lowerMessage)) {
      return 'academic';
    }
    
    // Admission keywords
    if (/admission|apply|eligibility|entrance|cutoff|seat|selection/.test(lowerMessage)) {
      return 'admission';
    }
    
    // Fee keywords
    if (/fee|payment|cost|charge|scholarship|financial/.test(lowerMessage)) {
      return 'fees';
    }
    
    // Hostel keywords
    if (/hostel|accommodation|room|mess|warden|stay/.test(lowerMessage)) {
      return 'hostel';
    }
    
    // Placement keywords
    if (/placement|job|company|recruit|career|interview/.test(lowerMessage)) {
      return 'placement';
    }
    
    // Campus keywords
    if (/campus|facility|library|lab|infrastructure/.test(lowerMessage)) {
      return 'campus';
    }

    return 'general';
  }

  private extractEntities(message: string): string[] {
    const entities: string[] = [];
    const lowerMessage = message.toLowerCase();

    // Department entities
    const departments = ['cse', 'it', 'ece', 'me', 'ce', 'computer science', 'information technology', 'mechanical', 'civil', 'electronics'];
    departments.forEach(dept => {
      if (lowerMessage.includes(dept)) {
        entities.push(`department:${dept}`);
      }
    });

    // Year entities
    const yearMatch = message.match(/\b(first|second|third|fourth|1st|2nd|3rd|4th|\d+)?\s*(year|semester)\b/i);
    if (yearMatch) {
      entities.push(`academic_year:${yearMatch[0]}`);
    }

    return entities;
  }

  // Health check endpoint for the Flask service
  async getFlaskHealth(): Promise<{ available: boolean; url: string }> {
    await this.checkFlaskHealth();
    return {
      available: this.isFlaskAvailable,
      url: this.flaskBaseUrl
    };
  }
}

// Singleton instance
export const flaskRAGService = new FlaskRAGService();