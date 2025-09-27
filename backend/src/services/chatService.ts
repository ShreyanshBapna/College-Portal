import { FAQ } from '../models/FAQ';
import { detectLanguage } from './languageService';
import { logger } from '../utils/logger';

export interface ChatResponse {
  message: string;
  language: string;
  confidence: number;
  intent: string;
  entities: string[];
  timestamp: Date;
  source?: string;
}

export async function processMessage(
  userMessage: string,
  userLanguage: string,
  sessionId: string
): Promise<ChatResponse> {
  try {
    const startTime = Date.now();
    const detectedLanguage = userLanguage || await detectLanguage(userMessage);
    const finalLanguage = detectedLanguage || 'en';
    const normalizedMessage = normalizeMessage(userMessage);
    const { intent, entities, confidence } = await extractIntentAndEntities(normalizedMessage, finalLanguage);
    const matchedFAQ = await findBestResponse(normalizedMessage, intent, finalLanguage);
    
    let response;
    if (matchedFAQ) {
      response = matchedFAQ.answer[finalLanguage] || matchedFAQ.answer['en'] || 'I understand your question, but I need more information to provide a specific answer.';
    } else {
      response = getFallbackResponse(finalLanguage, intent);
    }
    
    const processingTime = Date.now() - startTime;
    logger.info(`Response generated in ${processingTime}ms for session: ${sessionId}`);
    
    return {
      message: response,
      language: finalLanguage,
      confidence: confidence || 0.7,
      intent,
      entities,
      timestamp: new Date(),
      source: matchedFAQ ? 'faq_database' : 'fallback'
    };

  } catch (error: any) {
    logger.error('Chat processing error:', error);
    return {
      message: 'I apologize, but I\'m experiencing technical difficulties. Please try again later or contact support.',
      language: userLanguage || 'en',
      confidence: 0.1,
      intent: 'error',
      entities: [],
      timestamp: new Date(),
      source: 'error_handler'
    };
  }
}

function normalizeMessage(message: string): string {
  return message.toLowerCase().trim();
}

async function extractIntentAndEntities(message: string, language: string): Promise<{
  intent: string;
  entities: string[];
  confidence: number;
}> {
  const academicKeywords = ['marks', 'grade', 'result', 'exam', 'test', 'course', 'subject'];
  const hostelKeywords = ['hostel', 'room', 'accommodation', 'mess', 'warden'];
  const feeKeywords = ['fee', 'payment', 'due', 'charge', 'cost', 'amount'];

  const lowerMessage = message.toLowerCase();
  
  let intent = 'general';
  if (academicKeywords.some(keyword => lowerMessage.includes(keyword))) {
    intent = 'academic';
  } else if (hostelKeywords.some(keyword => lowerMessage.includes(keyword))) {
    intent = 'hostel';
  } else if (feeKeywords.some(keyword => lowerMessage.includes(keyword))) {
    intent = 'fees';
  }

  return {
    intent,
    entities: [],
    confidence: 0.8
  };
}

async function findBestResponse(message: string, intent: string, language: string): Promise<any> {
  try {
    const faqs = await FAQ.find({ category: intent }).limit(5);
    if (faqs.length > 0) {
      return faqs[0];
    }
    return null;
  } catch (error) {
    logger.error('Error finding FAQ response:', error);
    return null;
  }
}

function getFallbackResponse(language: string, intent: string): string {
  const fallbacks = {
    en: {
      academic: 'For academic queries, please contact the academic office or check your student portal.',
      hostel: 'For hostel-related queries, please contact the hostel office or speak to your warden.',
      fees: 'For fee-related queries, please visit the accounts office or check your fee status online.',
      general: 'Thank you for your query. For specific information, please contact the college administration.'
    },
    hi: {
      academic: 'शैक्षणिक प्रश्नों के लिए, कृपया शैक्षणिक कार्यालय से संपर्क करें।',
      hostel: 'छात्रावास संबंधी प्रश्नों के लिए, कृपया छात्रावास कार्यालय से संपर्क करें।',
      fees: 'शुल्क संबंधी प्रश्नों के लिए, कृपया खाता कार्यालय में जाएं।',
      general: 'आपकी पूछताछ के लिए धन्यवाद। कृपया कॉलेज प्रशासन से संपर्क करें।'
    },
    raj: {
      academic: 'पढाई के बारे में पूछताछ के लिए, कृपया शिक्षा कार्यालय से बात करें।',
      hostel: 'छात्रावास की बात के लिए, वार्डन से मिलें।',
      fees: 'फीस की बात के लिए, खाता कार्यालय जाएं।',
      general: 'आपकी बात के लिए धन्यवाद। कॉलेज से संपर्क करें।'
    }
  };

  const langFallbacks = fallbacks[language as keyof typeof fallbacks] || fallbacks.en;
  return langFallbacks[intent as keyof typeof langFallbacks] || langFallbacks.general;
}
