// Simple language detection service
// In production, you might want to use a more sophisticated library like franc or langdetect

export async function detectLanguage(text: string): Promise<string> {
  // Simple heuristic-based language detection
  const hindiPattern = /[\u0900-\u097F]/;
  const rajasthaniKeywords = ['थारो', 'म्हैं', 'सूं', 'करो', 'माफ', 'कोनी'];
  
  // Check for Hindi/Devanagari script
  if (hindiPattern.test(text)) {
    // Check if it might be Rajasthani
    const rajasthaniWordCount = rajasthaniKeywords.reduce((count, keyword) => {
      return text.includes(keyword) ? count + 1 : count;
    }, 0);
    
    if (rajasthaniWordCount > 0) {
      return 'raj';
    }
    return 'hi';
  }
  
  // Check for common Rajasthani words in Roman script
  const rajasthaniRomanKeywords = ['tharo', 'mhane', 'sun', 'karo', 'maaf', 'koni'];
  const rajasthaniRomanCount = rajasthaniRomanKeywords.reduce((count, keyword) => {
    return text.toLowerCase().includes(keyword) ? count + 1 : count;
  }, 0);
  
  if (rajasthaniRomanCount > 0) {
    return 'raj';
  }
  
  // Check for Hindi words in Roman script
  const hindiRomanKeywords = ['aap', 'hum', 'kya', 'hai', 'nahin', 'namaste', 'dhanyawad'];
  const hindiRomanCount = hindiRomanKeywords.reduce((count, keyword) => {
    return text.toLowerCase().includes(keyword) ? count + 1 : count;
  }, 0);
  
  if (hindiRomanCount > 0) {
    return 'hi';
  }
  
  // Default to English
  return 'en';
}

export function getSupportedLanguages() {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी' }
  ];
}

export function isValidLanguageCode(code: string): boolean {
  const supportedCodes = ['en', 'hi', 'raj'];
  return supportedCodes.includes(code);
}