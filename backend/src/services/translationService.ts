// Translation service for multilingual support
// This is a basic implementation. In production, you might want to integrate with
// services like Google Translate API, Microsoft Translator, or Azure Cognitive Services

interface TranslationMap {
  [key: string]: {
    [key: string]: string;
  };
}

// Basic translation dictionary for common phrases
const translations: TranslationMap = {
  // Greetings
  "hello": {
    "hi": "नमस्ते",
    "raj": "नमस्ते",
    "en": "hello"
  },
  "welcome": {
    "hi": "स्वागत है",
    "raj": "खुश आमदीद",
    "en": "welcome"
  },
  "thank you": {
    "hi": "धन्यवाद",
    "raj": "धन्यवाद",
    "en": "thank you"
  },

  // Common responses
  "I understand": {
    "hi": "मैं समझ गया",
    "raj": "म्हैं समझ गयो",
    "en": "I understand"
  },
  "Please wait": {
    "hi": "कृपया प्रतीक्षा करें",
    "raj": "कृपया इंतजार करो",
    "en": "Please wait"
  },
  "How can I help you?": {
    "hi": "मैं आपकी कैसे सहायता कर सकता हूँ?",
    "raj": "म्हैं थारी कैसे मदद कर सकूं?",
    "en": "How can I help you?"
  },

  // Academic terms
  "admission": {
    "hi": "प्रवेश",
    "raj": "दाखलो",
    "en": "admission"
  },
  "fees": {
    "hi": "शुल्क",
    "raj": "फीस",
    "en": "fees"
  },
  "course": {
    "hi": "पाठ्यक्रम",
    "raj": "कोर्स",
    "en": "course"
  },
  "scholarship": {
    "hi": "छात्रवृत्ति",
    "raj": "छात्रवृत्ति",
    "en": "scholarship"
  },
  "library": {
    "hi": "पुस्तकालय",
    "raj": "पुस्तकालय",
    "en": "library"
  },
  "hostel": {
    "hi": "छात्रावास",
    "raj": "छात्रावास",
    "en": "hostel"
  }
};

export async function translateText(
  text: string, 
  fromLanguage: string, 
  toLanguage: string
): Promise<string> {
  try {
    // If same language, return as is
    if (fromLanguage === toLanguage) {
      return text;
    }

    // Try to find exact match in translation dictionary
    const exactMatch = translations[text.toLowerCase()];
    if (exactMatch && exactMatch[toLanguage]) {
      return exactMatch[toLanguage];
    }

    // Try word-by-word translation for basic phrases
    const words = text.toLowerCase().split(' ');
    const translatedWords = words.map(word => {
      const wordTranslation = translations[word];
      return wordTranslation && wordTranslation[toLanguage] 
        ? wordTranslation[toLanguage] 
        : word;
    });

    const translatedText = translatedWords.join(' ');
    
    // If translation changed, return it; otherwise return original
    if (translatedText !== text.toLowerCase()) {
      return translatedText;
    }

    // Fallback: Return original text if no translation available
    // In production, this is where you'd call an external translation API
    return await callExternalTranslationService(text, fromLanguage, toLanguage);

  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
}

async function callExternalTranslationService(
  text: string,
  fromLang: string,
  toLang: string
): Promise<string> {
  // This is where you would integrate with external translation services
  // For now, return original text
  
  // Example integration points:
  // - Google Translate API
  // - Microsoft Translator
  // - Azure Cognitive Services
  // - AWS Translate
  
  console.log(`Translation service called: ${text} (${fromLang} -> ${toLang})`);
  return text;
}

export function addTranslation(
  originalText: string,
  language: string,
  translatedText: string
): void {
  if (!translations[originalText.toLowerCase()]) {
    translations[originalText.toLowerCase()] = {};
  }
  const textTranslations = translations[originalText.toLowerCase()];
  if (textTranslations) {
    textTranslations[language] = translatedText;
  }
}

export function getAvailableTranslations(text: string): string[] {
  const textTranslations = translations[text.toLowerCase()];
  return textTranslations ? Object.keys(textTranslations) : [];
}

// Batch translation for multiple texts
export async function translateBatch(
  texts: string[],
  fromLanguage: string,
  toLanguage: string
): Promise<string[]> {
  const promises = texts.map(text => translateText(text, fromLanguage, toLanguage));
  return Promise.all(promises);
}