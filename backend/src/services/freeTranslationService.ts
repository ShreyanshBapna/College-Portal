







/**
 * Free Translation Service - No API keys required!
 * Uses multiple free services with fallback
 */

interface TranslationService {
  name: string;
  url: string;
  dailyLimit: number;
  method: 'GET' | 'POST';
}

interface MyMemoryResponse {
  responseStatus: number;
  responseData: {
    translatedText: string;
  };
}

interface LibreTranslateResponse {
  translatedText: string;
}

interface Dictionary {
  [key: string]: {
    [word: string]: string;
  };
}

class FreeTranslationService {
  private services: TranslationService[];
  private requestCount: number;

  constructor() {
    this.services = [
      {
        name: 'MyMemory',
        url: 'https://api.mymemory.translated.net/get',
        dailyLimit: 5000,
        method: 'GET'
      },
      {
        name: 'LibreTranslate',
        url: 'https://libretranslate.de/translate',
        dailyLimit: 1000,
        method: 'POST'
      }
    ];
    this.requestCount = 0;
  }

  /**
   * Translate text using free services
   * @param text - Text to translate
   * @param from - Source language (en, hi, raj)
   * @param to - Target language (en, hi, raj)
   */
  async translateText(text: string, from: string, to: string): Promise<string> {
    // Handle Rajasthani by mapping to Hindi
    const fromLang = from === 'raj' ? 'hi' : from;
    const toLang = to === 'raj' ? 'hi' : to;

    // If same language, return original
    if (fromLang === toLang) return text;

    try {
      // Try MyMemory first (completely free)
      const myMemoryResult = await this.translateWithMyMemory(text, fromLang, toLang);
      if (myMemoryResult) return myMemoryResult;

      // Fallback to LibreTranslate
      const libreResult = await this.translateWithLibre(text, fromLang, toLang);
      if (libreResult) return libreResult;

      // Final fallback: basic dictionary
      return this.basicDictionaryTranslate(text, from, to);

    } catch (error) {
      console.error('Translation failed:', error);
      return this.basicDictionaryTranslate(text, from, to);
    }
  }

  /**
   * MyMemory Translation (5000 requests/day, no API key)
   */
  private async translateWithMyMemory(text: string, from: string, to: string): Promise<string | null> {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'SIH-2025-Campus-Assistant'
        }
      });

      if (!response.ok) throw new Error('MyMemory API failed');

      const data = await response.json() as MyMemoryResponse;
      
      if (data.responseStatus === 200 && data.responseData) {
        return data.responseData.translatedText;
      }
      
      return null;
    } catch (error) {
      console.warn('MyMemory translation failed:', error);
      return null;
    }
  }

  /**
   * LibreTranslate (20 requests/minute, no API key)
   */
  private async translateWithLibre(text: string, from: string, to: string): Promise<string | null> {
    try {
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: from,
          target: to,
          format: 'text'
        })
      });

      if (!response.ok) throw new Error('LibreTranslate API failed');

      const data = await response.json() as LibreTranslateResponse;
      return data.translatedText;
      
    } catch (error) {
      console.warn('LibreTranslate failed:', error);
      return null;
    }
  }

  /**
   * Basic dictionary fallback (always works offline)
   */
  private basicDictionaryTranslate(text: string, from: string, to: string): string {
    const dictionary: Dictionary = {
      // English to Hindi
      'en_hi': {
        'hello': 'नमस्ते',
        'thank you': 'धन्यवाद',
        'admission': 'प्रवेश',
        'fees': 'फीस',
        'course': 'कोर्स',
        'library': 'पुस्तकालय',
        'hostel': 'छात्रावास',
        'scholarship': 'छात्रवृत्ति',
        'campus': 'कैंपस',
        'student': 'छात्र',
        'college': 'कॉलेज',
        'university': 'विश्वविद्यालय'
      },
      
      // Hindi to English
      'hi_en': {
        'नमस्ते': 'hello',
        'धन्यवाद': 'thank you',
        'प्रवेश': 'admission',
        'फीस': 'fees',
        'कोर्स': 'course',
        'पुस्तकालय': 'library',
        'छात्रावास': 'hostel',
        'छात्रवृत्ति': 'scholarship',
        'कैंपस': 'campus',
        'छात्र': 'student',
        'कॉलेज': 'college',
        'विश्वविद्यालय': 'university'
      },

      // English to Rajasthani
      'en_raj': {
        'hello': 'नमस्कार',
        'thank you': 'धन्यवाद',
        'admission': 'दाखलो',
        'fees': 'फीस',
        'course': 'कोर्स',
        'library': 'पुस्तकालय',
        'hostel': 'छात्रावास',
        'campus': 'कैंपस',
        'student': 'विद्यार्थी',
        'college': 'कॉलेज'
      },

      // Rajasthani to English
      'raj_en': {
        'नमस्कार': 'hello',
        'धन्यवाद': 'thank you',
        'दाखलो': 'admission',
        'फीस': 'fees',
        'विद्यार्थी': 'student',
        'कैंपस': 'campus',
        'कॉलेज': 'college'
      }
    };

    const key = `${from}_${to}`;
    const dict = dictionary[key] || {};
    
    let translated = text.toLowerCase();
    
    // Replace known words
    Object.entries(dict).forEach(([source, target]) => {
      const regex = new RegExp(`\\b${source}\\b`, 'gi');
      translated = translated.replace(regex, target);
    });

    return translated;
  }

  /**
   * Detect language (free, no API needed)
   */
  detectLanguage(text: string): string {
    // Devanagari script detection
    const devanagariRegex = /[\u0900-\u097F]/;
    
    if (devanagariRegex.test(text)) {
      // Check for Rajasthani-specific words
      const rajasthaniWords = ['थारो', 'म्हैं', 'सै', 'को', 'नै', 'रो', 'री'];
      const hasRajasthani = rajasthaniWords.some(word => text.includes(word));
      
      return hasRajasthani ? 'raj' : 'hi';
    }
    
    return 'en'; // Default to English
  }

  /**
   * Get usage statistics
   */
  getUsageStats(): { requestCount: number; services: TranslationService[] } {
    return {
      requestCount: this.requestCount,
      services: this.services
    };
  }
}

export default FreeTranslationService;