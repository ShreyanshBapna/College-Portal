import { FAQ } from '../models/FAQ';
import { translateText } from './translationService';
import { detectLanguage } from './languageService';
import { logger } from '../utils/logger';

// Import our free services (TypeScript)
import FreeTranslationService from './freeTranslationService';
import FreeAIService from './freeAIService';

const freeTranslation = new FreeTranslationService();
const freeAI = new FreeAIService();

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

    // Detect language if not provided or uncertain
    const detectedLanguage = freeTranslation.detectLanguage(userMessage) || userLanguage || 'en';
    const finalLanguage = userLanguage || detectedLanguage;

    // Normalize the message for processing
    const normalizedMessage = normalizeMessage(userMessage);

    // Extract intent and entities
    const { intent, entities, confidence } = await extractIntentAndEntities(normalizedMessage, finalLanguage);

    // Try enhanced AI service first for better responses
    let response;
    try {
      response = await freeAI.generateEnhancedResponse(userMessage, finalLanguage, intent);
      
      // If AI service gives a good response, use it
      if (response && response.confidence > 0.5) {
        const processingTime = Date.now() - startTime;
        logger.info(`Enhanced AI response generated in ${processingTime}ms for session: ${sessionId}`);
        
        return {
          message: response.answer,
          language: finalLanguage,
          confidence: response.confidence,
          intent,
          entities,
          timestamp: new Date(),
          source: response.source || 'enhanced_ai'
        };
      }
    } catch (aiError: any) {
      logger.warn('Enhanced AI service fallback:', aiError?.message || 'Unknown error');
    }

    // Fallback to FAQ matching if AI doesn't provide good response
    const faqResponse = await findBestResponse(normalizedMessage, intent, finalLanguage);
    if (faqResponse) {
      const processingTime = Date.now() - startTime;
      logger.info(`FAQ response found in ${processingTime}ms for session: ${sessionId}`);
      
      return {
        message: faqResponse.answer,
        language: faqResponse.language,
        confidence: 0.7,
        intent,
        entities,
        timestamp: new Date(),
        source: 'faq_database'
      };
    }

    // Final fallback to enhanced contextual responses
    const fallbackResponse = await getFallbackResponse(finalLanguage, intent);
    const processingTime = Date.now() - startTime;
    logger.info(`Fallback response generated in ${processingTime}ms for session: ${sessionId}`);

    return {
      message: fallbackResponse.answer,
      language: finalLanguage,
      confidence: 0.8,
      intent,
      entities,
      timestamp: new Date(),
      source: 'enhanced_fallback'
    };

  } catch (error) {
    logger.error('Error processing message:', error);
    
    return {
      message: getErrorMessage(userLanguage),
      language: userLanguage,
      confidence: 0,
      intent: 'error',
      entities: [],
      timestamp: new Date(),
      source: 'error_handler'
    };
  }
}

function normalizeMessage(message: string): string {
  return message
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ');
}

async function extractIntentAndEntities(message: string, language: string) {
  // Simple keyword-based intent detection
  // In production, you might use more sophisticated NLP libraries
  
  const intents = {
    greeting: ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'adaab'],
    fees: ['fee', 'fees', 'payment', 'cost', 'amount', 'price', 'shulk'],
    admission: ['admission', 'admit', 'course', 'program', 'pravesh', 'bhartī'],
    scholarship: ['scholarship', 'chhatravritti', 'financial aid', 'grant'],
    academic: ['marks', 'grades', 'exam', 'result', 'syllabus', 'pariksha'],
    library: ['library', 'book', 'pustkalaya', 'kitab'],
    hostel: ['hostel', 'accommodation', 'room', 'chhaatravas'],
    contact: ['contact', 'phone', 'email', 'address', 'sampark'],
    placement: ['placement', 'job', 'career', 'company', 'interview'],
    facilities: ['facility', 'infrastructure', 'lab', 'equipment']
  };

  let detectedIntent = 'general';
  let maxScore = 0;
  const entities: string[] = [];

  // Simple keyword matching
  for (const [intent, keywords] of Object.entries(intents)) {
    const score = keywords.reduce((count, keyword) => {
      return message.includes(keyword) ? count + 1 : count;
    }, 0);

    if (score > maxScore) {
      maxScore = score;
      detectedIntent = intent;
    }
  }

  // Extract entities (simple number and date extraction)
  const numberMatches = message.match(/\d+/g);
  if (numberMatches) {
    entities.push(...numberMatches);
  }

  const confidence = maxScore > 0 ? Math.min(0.9, maxScore * 0.3) : 0.1;

  return { intent: detectedIntent, entities, confidence };
}

async function findBestResponse(message: string, intent: string, language: string) {
  try {
    // Search for FAQ based on intent and language
    const faqs = await FAQ.find({
      language,
      category: intent === 'general' ? { $exists: true } : intent,
      isActive: true
    }).sort({ accessCount: -1 });

    if (faqs.length === 0) {
      // Try to find FAQ in any language if not found in user's language
      const fallbackFAQs = await FAQ.find({
        category: intent === 'general' ? { $exists: true } : intent,
        isActive: true
      }).sort({ accessCount: -1 });

      if (fallbackFAQs.length > 0 && fallbackFAQs[0]) {
        const fallbackFAQ = fallbackFAQs[0];
        fallbackFAQ.accessCount += 1;
        await fallbackFAQ.save();
        return fallbackFAQ;
      }
    } else {
      // Simple keyword matching within FAQs
      let bestMatch = faqs[0];
      let bestScore = 0;

      for (const faq of faqs) {
        const questionWords = faq.question.toLowerCase().split(' ');
        const messageWords = message.split(' ');
        
        const commonWords = questionWords.filter(word => 
          messageWords.includes(word) && word.length > 2
        );
        
        const score = commonWords.length / questionWords.length;
        
        if (score > bestScore) {
          bestScore = score;
          bestMatch = faq;
        }
      }

      if (bestScore > 0.2 && bestMatch) {
        bestMatch.accessCount += 1;
        await bestMatch.save();
        return bestMatch;
      }
    }

    return null;
  } catch (error) {
    logger.error('Error finding FAQ response:', error);
    return null;
  }
}

async function getFallbackResponse(language: string, intent?: string) {
  // Enhanced fallback responses based on intent
  const intentBasedResponses = {
    en: {
      greeting: "Hello! Welcome to JECRC Foundation. I'm here to help you with information about admissions, courses, fees, facilities, and more. How can I assist you today?",
      fees: "The fee structure varies by course. Engineering courses range from ₹80,000 to ₹1,20,000 per year, and Management courses range from ₹70,000 to ₹1,00,000 per year. Scholarships and payment plans are available. Would you like specific information about any course?",
      admission: "JECRC Foundation offers admissions in Engineering, Management, and other programs. For Engineering, you need JEE Main/REAP qualification. For Management, CAT/MAT/CMAT scores are required. Would you like details about specific admission requirements?",
      scholarship: "We offer merit-based scholarships up to 100% fee waiver, need-based assistance, government scholarships, and sports scholarships. Academic excellence is rewarded with various scholarship programs. Would you like to know about eligibility criteria?",
      library: "Our library is open 8 AM to 10 PM on weekdays and 9 AM to 6 PM on weekends. It has 50,000+ books, digital resources, Wi-Fi, and study areas. Students can borrow up to 5 books for 15 days.",
      hostel: "We provide separate hostels for boys and girls with modern amenities, mess facilities, Wi-Fi, security, and recreational facilities. Hostel fees range from ₹60,000 to ₹80,000 per year including meals.",
      placement: "JECRC has 85%+ placement rate with companies like TCS, Infosys, Wipro, Amazon visiting campus. Average packages range from ₹3-6 LPA with highest going up to ₹25 LPA. Pre-placement training is provided.",
      contact: "You can reach us at +91-141-2770000, email: info@jecrc.ac.in, or visit our campus at Jaipur-Jodhpur Highway, Ramchapdra, Jaipur. Admissions office is open Monday to Saturday, 9 AM to 5 PM.",
      default: "I'm here to help you with JECRC Foundation queries! You can ask me about admissions, fees, courses, scholarships, facilities, placement, library, hostel, or any other college-related information. What would you like to know?"
    },
    hi: {
      greeting: "नमस्ते! JECRC Foundation में आपका स्वागत है। मैं प्रवेश, कोर्स, फीस, सुविधाओं और अन्य जानकारी में आपकी सहायता के लिए यहाँ हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?",
      fees: "फीस संरचना कोर्स के अनुसार अलग है। इंजीनियरिंग कोर्स ₹80,000 से ₹1,20,000 प्रति वर्ष और मैनेजमेंट कोर्स ₹70,000 से ₹1,00,000 प्रति वर्ष है। छात्रवृत्ति और भुगतान योजनाएं उपलब्ध हैं। क्या आप किसी विशिष्ट कोर्स के बारे में जानना चाहते हैं?",
      admission: "JECRC Foundation इंजीनियरिंग, मैनेजमेंट और अन्य कार्यक्रमों में प्रवेश प्रदान करता है। इंजीनियरिंग के लिए JEE Main/REAP योग्यता चाहिए। मैनेजमेंट के लिए CAT/MAT/CMAT स्कोर आवश्यक है। क्या आप विशिष्ट प्रवेश आवश्यकताओं के बारे में जानना चाहते हैं?",
      scholarship: "हम मेरिट-आधारित छात्रवृत्ति 100% तक फीस माफी, जरूरत-आधारित सहायता, सरकारी छात्रवृत्ति, और खेल छात्रवृत्ति प्रदान करते हैं। शैक्षणिक उत्कृष्टता को विभिन्न छात्रवृत्ति कार्यक्रमों से पुरस्कृत किया जाता है।",
      library: "हमारी लाइब्रेरी सप्ताह के दिन सुबह 8 से रात 10 बजे और सप्ताहांत पर सुबह 9 से शाम 6 बजे तक खुली रहती है। इसमें 50,000+ किताबें, डिजिटल संसाधन, Wi-Fi, और अध्ययन क्षेत्र हैं।",
      hostel: "हम आधुनिक सुविधाओं, मेस सुविधाओं, Wi-Fi, सुरक्षा, और मनोरंजन सुविधाओं के साथ लड़कों और लड़कियों के लिए अलग हॉस्टल प्रदान करते हैं। हॉस्टल फीस भोजन सहित ₹60,000 से ₹80,000 प्रति वर्ष है।",
      default: "मैं JECRC Foundation के प्रश्नों में आपकी सहायता के लिए यहाँ हूँ! आप मुझसे प्रवेश, फीस, कोर्स, छात्रवृत्ति, सुविधाएं, प्लेसमेंट, लाइब्रेरी, हॉस्टल, या कॉलेज से संबंधित किसी भी जानकारी के बारे में पूछ सकते हैं।"
    },
    raj: {
      greeting: "नमस्कार! JECRC Foundation म्हैं थारो स्वागत सै। म्हैं दाखलो, कोर्स, फीस, सुविधावां अर दूजी जानकारी म्हैं थारी मदद करने खातर यहाँ हूँ। आज म्हैं थारी कैसे मदद कर सकूं?",
      fees: "फीस कोर्स के हिसाब सूं अलग सै। इंजीनियरिंग कोर्स ₹80,000 सूं ₹1,20,000 साल अर मैनेजमेंट कोर्स ₹70,000 सूं ₹1,00,000 साल सै। स्कॉलरशिप अर पेमेंट प्लान उपलब्ध सै।",
      admission: "JECRC Foundation इंजीनियरिंग, मैनेजमेंट अर दूजे प्रोग्राम म्हैं दाखलो देवै सै। इंजीनियरिंग खातर JEE Main/REAP की जरूरत सै। मैनेजमेंट खातर CAT/MAT/CMAT स्कोर चाहिए।",
      default: "म्हैं JECRC Foundation के सवालों म्हैं थारी मदद करने खातर यहाँ हूँ! थे म्हारै सूं दाखलो, फीस, कोर्स, स्कॉलरशिप, सुविधावां, प्लेसमेंट, लाइब्रेरी, हॉस्टल या कॉलेज सूं जुड़ी किसे भी जानकारी के बारे म्हैं पूछ सको।"
    }
  };

  const responses = intentBasedResponses[language as keyof typeof intentBasedResponses] || intentBasedResponses.en;
  const intentResponse = intent && responses[intent as keyof typeof responses];
  
  return {
    answer: intentResponse || responses.default,
    language: language
  };
}

function getErrorMessage(language: string): string {
  const errorMessages = {
    en: "I'm experiencing some technical difficulties. Please try again later or contact our support team.",
    hi: "मुझे कुछ तकनीकी समस्या आ रही है। कृपया बाद में कोशिश करें या हमारी सहायता टीम से संपर्क करें।",
    raj: "म्हनै कुछ तकनीकी दिक्कत आवै सै। कृपया बाद म्हैं कोशिश करो या म्हारी सहायता टीम सूं संपर्क करो।"
  };

  return errorMessages[language as keyof typeof errorMessages] || errorMessages.en;
}