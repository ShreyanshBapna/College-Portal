/**
 * Free AI Service using Hugging Face Inference API
 * 30,000 requests/month completely FREE!
 */

interface AIModels {
  chat: string;
  multilingual: string;
  sentiment: string;
  qa: string;
}

interface AIResponse {
  answer: string;
  language: string;
  confidence: number;
  source: string;
  category?: string;
}

interface HuggingFaceResponse {
  generated_text?: string;
  answer?: string;
  score?: number;
}

interface SentimentResult {
  label: string;
  score: number;
}

interface KeywordData {
  keywords: string[];
  weight: number;
}

interface KeywordMapping {
  [category: string]: KeywordData;
}

interface LanguageResponses {
  [intent: string]: string;
}

interface ResponseMapping {
  [language: string]: LanguageResponses;
}

interface EnhancedKnowledge {
  [category: string]: {
    en: string;
    hi: string;
    raj: string;
  };
}

interface MatchResult {
  response: string;
  confidence: number;
  category: string;
}

class FreeAIService {
  private baseUrl: string;
  private models: AIModels;
  private requestCount: number;
  private dailyLimit: number;

  constructor() {
    this.baseUrl = 'https://api-inference.huggingface.co/models';
    this.models = {
      chat: 'microsoft/DialoGPT-medium',
      multilingual: 'facebook/mbart-large-50-many-to-many-mmt',
      sentiment: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
      qa: 'deepset/roberta-base-squad2'
    };
    this.requestCount = 0;
    this.dailyLimit = 1000; // Conservative limit
  }

  /**
   * Generate chat response using free Hugging Face model
   */
  async generateResponse(message: string, language: string = 'en'): Promise<AIResponse> {
    try {
      // Check if we have HF token
      const token = process.env.HUGGINGFACE_API_KEY;
      if (!token || token === 'your-huggingface-api-key') {
        return this.fallbackResponse(message, language);
      }

      const response = await fetch(`${this.baseUrl}/${this.models.chat}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HF API error: ${response.status}`);
      }

      const data = await response.json() as HuggingFaceResponse[];
      
      this.requestCount++;
      
      return {
        answer: data[0]?.generated_text || 'I understand your question. How can I help you with JECRC Foundation?',
        language: language,
        confidence: 0.8,
        source: 'huggingface'
      };

    } catch (error) {
      console.error('HuggingFace API error:', error);
      return this.fallbackResponse(message, language);
    }
  }

  /**
   * Question-answering using free model
   */
  async answerQuestion(question: string, context: string): Promise<AIResponse> {
    try {
      const token = process.env.HUGGINGFACE_API_KEY;
      if (!token || token === 'your-huggingface-api-key') {
        return this.searchInContext(question, context);
      }

      const response = await fetch(`${this.baseUrl}/${this.models.qa}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            question: question,
            context: context
          }
        })
      });

      const data = await response.json() as HuggingFaceResponse;
      
      return {
        answer: data.answer || 'I found relevant information in our knowledge base.',
        confidence: data.score || 0.7,
        language: 'en',
        source: 'huggingface'
      };

    } catch (error) {
      console.error('QA service error:', error);
      return this.searchInContext(question, context);
    }
  }

  /**
   * Sentiment analysis (free)
   */
  async analyzeSentiment(text: string): Promise<SentimentResult> {
    try {
      const token = process.env.HUGGINGFACE_API_KEY;
      if (!token || token === 'your-huggingface-api-key') {
        return this.basicSentiment(text);
      }

      const response = await fetch(`${this.baseUrl}/${this.models.sentiment}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text
        })
      });

      const data = await response.json() as SentimentResult[];
      return data[0] || this.basicSentiment(text);

    } catch (error) {
      return this.basicSentiment(text);
    }
  }

  /**
   * Enhanced chat response with better intelligence
   */
  async generateEnhancedResponse(message: string, language: string = 'en', intent: string = 'general'): Promise<AIResponse> {
    try {
      // First check our enhanced knowledge base
      const knowledgeResponse = this.getEnhancedKnowledgeResponse(message, language, intent);
      if (knowledgeResponse.confidence > 0.3) { // Lowered threshold
        return knowledgeResponse;
      }

      // Try external AI API if available (skip for now)
      // const aiResponse = await this.tryExternalAI(message, language);
      // if (aiResponse && aiResponse.confidence > 0.7) {
      //   return aiResponse;
      // }

      // Fallback to our enhanced contextual responses
      return this.getContextualResponse(message, language, intent);
    } catch (error) {
      console.error('Enhanced AI error:', error);
      return this.getContextualResponse(message, language, intent);
    }
  }

  /**
   * Enhanced knowledge base with more specific JECRC information
   */
  getEnhancedKnowledgeResponse(message: string, language: string, intent: string): AIResponse {
    const enhancedKnowledge: EnhancedKnowledge = {
      admission: {
        en: "🎓 JECRC Foundation Admissions:\n\n📋 Engineering: JEE Main/REAP required (Cutoff: 50k-150k rank)\n📋 Management: CAT/MAT/CMAT accepted (Percentile: 50+)\n📋 Application Period: March-July\n📞 Admissions Office: +91-141-2770000\n🌐 Apply online: admissions.jecrc.ac.in\n\n💡 Documents needed: 10th/12th certificates, entrance scores, category certificate (if applicable)",
        hi: "🎓 JECRC Foundation प्रवेश:\n\n📋 इंजीनियरिंग: JEE Main/REAP आवश्यक (कटऑफ: 50k-150k रैंक)\n📋 मैनेजमेंट: CAT/MAT/CMAT स्वीकार (प्रतिशत: 50+)\n📋 आवेदन अवधि: मार्च-जुलाई\n📞 प्रवेश कार्यालय: +91-141-2770000\n\n💡 आवश्यक दस्तावेज: 10वीं/12वीं प्रमाणपत्र, प्रवेश स्कोर, श्रेणी प्रमाणपत्र",
        raj: "🎓 JECRC Foundation प्रवेश:\n\n📋 इंजीनियरिंग: JEE Main/REAP चाहिए (कटऑफ: 50k-150k रैंक)\n📋 मैनेजमेंट: CAT/MAT/CMAT लेवै सै\n📋 आवेदन: मार्च तै जुलाई तक\n📞 दाखला ऑफिस: +91-141-2770000"
      },
      fees: {
        en: "💰 JECRC Fee Structure (2024-25):\n\n🔧 Engineering: ₹80,000-1,20,000/year\n💼 Management: ₹70,000-1,00,000/year\n💻 BCA/MCA: ₹60,000-80,000/year\n🎨 Design: ₹75,000-95,000/year\n\n🏆 Scholarships: Up to 100% for merit\n💳 Payment: EMI options available\n🏦 Education loans supported\n📞 Fees Office: +91-141-2770000 Ext: 234",
        hi: "💰 JECRC फीस संरचना (2024-25):\n\n🔧 इंजीनियरिंग: ₹80,000-1,20,000/वर्ष\n💼 मैनेजमेंट: ₹70,000-1,00,000/वर्ष\n💻 BCA/MCA: ₹60,000-80,000/वर्ष\n\n🏆 छात्रवृत्ति: मेरिट के लिए 100% तक\n💳 भुगतान: EMI विकल्प उपलब्ध\n🏦 शिक्षा ऋण समर्थित",
        raj: "💰 JECRC फीस (2024-25):\n\n🔧 इंजीनियरिंग: ₹80,000-1,20,000/साल\n💼 मैनेजमेंट: ₹70,000-1,00,000/साल\n\n🏆 स्कॉलरशिप: मेरिट के लिए 100% तक\n💳 EMI की सुविधा उपलब्ध"
      },
      courses: {
        en: "📚 JECRC Courses Offered:\n\n🔧 Engineering: CSE, ECE, ME, CE, EE, IT\n💼 Management: MBA, BBA, PGDM\n💻 Computer: BCA, MCA, B.Tech CSE\n🎨 Design: Fashion, Interior Design\n📊 Commerce: B.Com, M.Com\n📖 Arts: BA, MA in various streams\n\n⭐ Popular: CSE (500 seats), MBA (120 seats)\n🎯 Specializations: AI/ML, Data Science, Digital Marketing",
        hi: "📚 JECRC पाठ्यक्रम:\n\n🔧 इंजीनियरिंग: CSE, ECE, ME, CE, EE, IT\n💼 प्रबंधन: MBA, BBA, PGDM\n💻 कंप्यूटर: BCA, MCA, B.Tech CSE\n🎨 डिज़ाइन: फैशन, इंटीरियर डिज़ाइन\n\n⭐ लोकप्रिय: CSE (500 सीटें), MBA (120 सीटें)\n🎯 विशेषज्ञता: AI/ML, डेटा साइंस, डिजिटल मार्केटिंग",
        raj: "📚 JECRC कोर्स:\n\n🔧 इंजीनियरिंग: CSE, ECE, ME, CE, EE, IT\n💼 मैनेजमेंट: MBA, BBA, PGDM\n💻 कंप्यूटर: BCA, MCA\n\n⭐ लोकप्रिय: CSE, MBA\n🎯 स्पेशलाइजेशन: AI/ML, डेटा साइंस"
      },
      facilities: {
        en: "🏢 JECRC Campus Facilities:\n\n📚 Library: 50,000+ books, digital resources, 24/7 access\n🔬 Labs: Modern computer labs (500+ systems), engineering labs\n🏠 Hostel: Separate for boys/girls, AC rooms, WiFi, mess\n🍽️ Cafeteria: Multiple food courts, healthy options\n🏥 Medical: On-campus clinic, ambulance service\n🚌 Transport: College buses from major locations\n💪 Sports: Cricket ground, basketball, gym, indoor games\n🎭 Cultural: Auditorium (1000 capacity), music room\n📶 WiFi: High-speed internet throughout campus",
        hi: "🏢 JECRC कैंपस सुविधाएं:\n\n📚 पुस्तकालय: 50,000+ पुस्तकें, डिजिटल संसाधन, 24/7 पहुंच\n🔬 लैब: आधुनिक कंप्यूटर लैब (500+ सिस्टम), इंजीनियरिंग लैब\n🏠 छात्रावास: लड़के/लड़कियों के लिए अलग, AC कमरे, WiFi, मेस\n🍽️ कैंटीन: कई फूड कोर्ट, स्वस्थ विकल्प\n🏥 चिकित्सा: कैंपस क्लिनिक, एम्बुलेंस सेवा",
        raj: "🏢 JECRC कैंपस सुविधावां:\n\n📚 लाइब्रेरी: 50,000+ किताबां, डिजिटल रिसोर्स\n🔬 लैब: आधुनिक कंप्यूटर लैब, इंजीनियरिंग लैब\n🏠 हॉस्टल: छोरों/छोरियों खातर अलग, AC रूम, WiFi\n🍽️ कैंटीन: कई फूड कोर्ट\n🏥 मेडिकल: कैंपस क्लिनिक"
      },
      placement: {
        en: "🎯 JECRC Placement Record (2023-24):\n\n📈 Success Rate: 85%+ students placed\n💰 Salary Packages:\n  • Average: ₹3.5-6 LPA\n  • Highest: ₹25 LPA (Amazon)\n  • Starting: ₹2.5 LPA minimum\n\n🏢 Top Recruiters:\n  • Tech: TCS, Infosys, Wipro, Amazon, Microsoft\n  • Consulting: Accenture, IBM, Capgemini\n  • Finance: ICICI, HDFC, Bajaj\n\n🎓 Training: Resume building, mock interviews, soft skills\n📞 Placement Cell: +91-141-2770000 Ext: 456",
        hi: "🎯 JECRC प्लेसमेंट रिकॉर्ड (2023-24):\n\n📈 सफलता दर: 85%+ छात्र प्लेस्ड\n💰 वेतन पैकेज:\n  • औसत: ₹3.5-6 LPA\n  • सर्वोच्च: ₹25 LPA (Amazon)\n  • न्यूनतम: ₹2.5 LPA\n\n🏢 शीर्ष नियोक्ता:\n  • टेक: TCS, Infosys, Wipro, Amazon\n  • कंसल्टिंग: Accenture, IBM, Capgemini\n\n🎓 प्रशिक्षण: रिज्यूमे निर्माण, मॉक इंटरव्यू",
        raj: "🎯 JECRC प्लेसमेंट (2023-24):\n\n📈 सफलता: 85%+ छात्रावां को जॉब\n💰 सैलरी:\n  • औसत: ₹3.5-6 LPA\n  • सबसूं ज्यादा: ₹25 LPA\n\n🏢 टॉप कंपनी: TCS, Infosys, Amazon\n🎓 ट्रेनिंग: रिज्यूमे, इंटरव्यू की तैयारी"
      },
      hostel: {
        en: "🏠 JECRC Hostel Facilities:\n\n🏢 Separate hostels for boys and girls\n🏠 Furnished AC/Non-AC rooms\n🍽️ Vegetarian mess with healthy meals\n📶 High-speed Wi-Fi throughout\n🛡️ 24/7 security with CCTV\n🏥 Medical facilities on campus\n💪 Gym and recreational facilities\n🚿 Hot water supply\n📚 Study rooms and common areas\n\n💰 Fees: ₹60,000-₹80,000/year (including meals)\n📞 Hostel Office: +91-141-2770000 Ext: 567",
        hi: "🏠 JECRC हॉस्टल सुविधाएं:\n\n🏢 लड़कों और लड़कियों के लिए अलग हॉस्टल\n🏠 सुसज्जित AC/Non-AC कमरे\n🍽️ स्वस्थ भोजन के साथ शाकाहारी मेस\n📶 हाई-स्पीड Wi-Fi\n🛡️ CCTV के साथ 24/7 सुरक्षा\n🏥 कैंपस में चिकित्सा सुविधाएं\n💪 जिम और मनोरंजन सुविधाएं\n🚿 गर्म पानी की आपूर्ति\n📚 अध्ययन कक्ष और कॉमन एरिया\n\n💰 फीस: ₹60,000-₹80,000/वर्ष (भोजन सहित)",
        raj: "🏠 JECRC हॉस्टल सुविधावां:\n\n🏢 छोरों अर छोरियों खातर अलग हॉस्टल\n🏠 सुसज्जित AC/Non-AC कमरे\n🍽️ स्वस्थ खाना के साथ शाकाहारी मेस\n📶 हाई-स्पीड Wi-Fi\n🛡️ CCTV के साथ 24/7 सिक्योरिटी\n🏥 कैंपस में मेडिकल सुविधा\n💪 जिम अर मनोरंजन सुविधा\n🚿 गर्म पानी\n📚 पढ़ाई के कमरे अर कॉमन एरिया\n\n💰 फीस: ₹60,000-₹80,000/साल (खाना सहित)"
      }
    };

    const normalizedMessage = message.toLowerCase();
    let bestMatch: MatchResult = { response: '', confidence: 0, category: '' };

    // Enhanced keyword matching with weights
    const keywords: KeywordMapping = {
      admission: {
        keywords: ['admission', 'pravesh', 'dakhla', 'join', 'apply', 'bharti', 'प्रवेश', 'दाखला', 'entrance', 'eligibility', 'दाखले', 'जानकारी'],
        weight: 0.9
      },
      fees: {
        keywords: ['fee', 'fees', 'cost', 'price', 'amount', 'shulk', 'फीस', 'पैसा', 'खर्च', 'scholarship', 'छात्रवृत्ति'],
        weight: 0.9
      },
      courses: {
        keywords: ['course', 'program', 'degree', 'branch', 'stream', 'कोर्स', 'पाठ्यक्रम', 'cse', 'mba', 'engineering'],
        weight: 0.8
      },
      facilities: {
        keywords: ['facility', 'lab', 'library', 'hostel', 'campus', 'सुविधा', 'लाइब्रेरी', 'हॉस्टल', 'infrastructure', 'छात्रावास', 'accommodation', 'room'],
        weight: 0.8
      },
      hostel: {
        keywords: ['hostel', 'accommodation', 'room', 'mess', 'boarding', 'हॉस्टल', 'छात्रावास', 'कमरा', 'मेस', 'रहना'],
        weight: 0.9
      },
      placement: {
        keywords: ['placement', 'job', 'career', 'company', 'recruit', 'नौकरी', 'प्लेसमेंट', 'कंपनी', 'salary', 'package'],
        weight: 0.9
      }
    };

    for (const [category, data] of Object.entries(keywords)) {
      const matchCount = data.keywords.filter(keyword => normalizedMessage.includes(keyword)).length;
      if (matchCount > 0) {
        const confidence = Math.min(0.95, (matchCount * data.weight) + 0.5); // Increased base confidence
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            response: enhancedKnowledge[category] ? enhancedKnowledge[category][language as keyof typeof enhancedKnowledge[typeof category]] || enhancedKnowledge[category].en : '',
            confidence: confidence,
            category: category
          };
        }
      }
    }

    if (bestMatch.response) {
      return {
        answer: bestMatch.response,
        language: language,
        confidence: bestMatch.confidence,
        source: 'enhanced_knowledge',
        category: bestMatch.category
      };
    } else {
      return this.fallbackResponse(message, language, intent);
    }
  }

  fallbackResponse(message: string, language: string, intent: string = 'general'): AIResponse {
    const responses: ResponseMapping = {
      en: {
        greeting: "Hello! I'm here to help you with JECRC Foundation queries.",
        admission: "For admission information, please check our admissions office or website.",
        fees: "Fee structure varies by course. Please contact the accounts department.",
        courses: "We offer various undergraduate and postgraduate programs.",
        library: "Our library is open from 8 AM to 8 PM with extensive resources.",
        hostel: "JECRC provides separate hostels for boys and girls with modern amenities. Facilities include furnished rooms, mess with vegetarian meals, Wi-Fi, common rooms, gym, and 24/7 security. Hostel fees range from ₹60,000 to ₹80,000 per year including meals. Medical facilities and recreational activities are also available.",
        scholarship: "Multiple scholarship programs are available based on merit and need.",
        default: "I'd be happy to help! Could you please be more specific about your query?"
      },
      hi: {
        greeting: "नमस्ते! मैं JECRC Foundation के प्रश्नों में आपकी सहायता के लिए यहाँ हूँ।",
        admission: "प्रवेश की जानकारी के लिए, कृपया हमारे प्रवेश कार्यालय या वेबसाइट देखें।",
        fees: "फीस संरचना कोर्स के अनुसार अलग है। कृपया खाता विभाग से संपर्क करें।",
        courses: "हम विभिन्न स्नातक और स्नातकोत्तर कार्यक्रम प्रदान करते हैं।",
        library: "हमारी लाइब्रेरी सुबह 8 बजे से रात 8 बजे तक व्यापक संसाधनों के साथ खुली है।",
        hostel: "JECRC लड़कों और लड़कियों के लिए आधुनिक सुविधाओं के साथ अलग हॉस्टल प्रदान करता है। सुविधाओं में सुसज्जित कमरे, शाकाहारी भोजन के साथ मेस, Wi-Fi, कॉमन रूम, जिम, और 24/7 सुरक्षा शामिल है। हॉस्टल फीस भोजन सहित ₹60,000 से ₹80,000 प्रति वर्ष है।",
        scholarship: "योग्यता और आवश्यकता के आधार पर कई छात्रवृत्ति कार्यक्रम उपलब्ध हैं।",
        default: "मुझे मदद करने में खुशी होगी! क्या आप अपने प्रश्न के बारे में और विस्तार से बता सकते हैं?"
      },
      raj: {
        greeting: "नमस्कार! म्हैं JECRC Foundation के सवालों में थारी मदद करने खातर यहाँ हूँ।",
        admission: "दाखले की जानकारी खातर, प्रवेश कार्यालय या वेबसाइट देखो।",
        fees: "फीस कोर्स के मुताबिक अलग सै। खाता विभाग तै संपर्क करो।",
        courses: "म्हारै यहाँ विभिन्न स्नातक अर स्नातकोत्तर कार्यक्रम सै।",
        library: "म्हारी लाइब्रेरी सुबह 8 तै रात 8 बजे तक खुली रहवै सै।",
        hostel: "JECRC छोरों अर छोरियों खातर आधुनिक सुविधावां के साथ अलग हॉस्टल देवै सै। सुविधावां में सुसज्जित कमरे, शाकाहारी खाना के साथ मेस, Wi-Fi, कॉमन रूम, जिम, अर 24/7 सिक्योरिटी सै। हॉस्टल फीस खाना सहित ₹60,000 तै ₹80,000 प्रति साल सै।",
        scholarship: "योग्यता अर जरूरत के आधार पै कई छात्रवृत्ति कार्यक्रम सै।",
        default: "म्हैं मदद करने में खुश हूँ! थारो सवाल और साफ करके बताओ।"
      }
    };

    const languageResponses = responses[language] || responses.en;
    const responseText = (languageResponses && languageResponses[intent]) || 
                        (languageResponses && languageResponses.default) ||
                        'I apologize, but I could not understand your question. Please try asking in a different way.';

    return {
      answer: responseText,
      language: language,
      confidence: 0.6,
      source: 'fallback_response'
    };
  }

  /**
   * Get contextual response based on intent
   */
  getContextualResponse(message: string, language: string, intent: string): AIResponse {
    // Use our enhanced fallback response
    return this.fallbackResponse(message, language, intent);
  }

  /**
   * Simple context search fallback
   */
  searchInContext(question: string, context: string): AIResponse {
    const words = question.toLowerCase().split(' ');
    const contextLower = context.toLowerCase();
    
    // Find sentences containing question keywords
    const sentences = context.split(/[.!?]+/);
    const relevantSentences = sentences.filter(sentence => {
      const sentenceLower = sentence.toLowerCase();
      return words.some(word => sentenceLower.includes(word));
    });

    if (relevantSentences.length > 0) {
      return {
        answer: relevantSentences.slice(0, 3).join('. ').trim() + '.',
        confidence: 0.6,
        language: 'en',
        source: 'context_search'
      };
    }

    return {
      answer: 'I found some relevant information, but could you be more specific?',
      confidence: 0.3,
      language: 'en',
      source: 'context_search'
    };
  }

  /**
   * Basic sentiment analysis fallback
   */
  basicSentiment(text: string): SentimentResult {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'happy'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'sad', 'angry', 'frustrated', 'disappointed'];
    
    const lowerText = text.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) {
      return { label: 'POSITIVE', score: 0.7 };
    } else if (negativeCount > positiveCount) {
      return { label: 'NEGATIVE', score: 0.7 };
    } else {
      return { label: 'NEUTRAL', score: 0.5 };
    }
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): { requestCount: number; dailyLimit: number; remainingRequests: number } {
    return {
      requestCount: this.requestCount,
      dailyLimit: this.dailyLimit,
      remainingRequests: this.dailyLimit - this.requestCount
    };
  }
}

export default FreeAIService;