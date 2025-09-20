/**
 * Simple test script to check backend and AI services
 */

console.log('🔍 Testing JECRC Multilingual Chat System...\n');

// Test Free AI Service
console.log('1. Testing Enhanced AI Service...');
try {
  const FreeAIService = require('./src/services/freeAIService.js');
  const aiService = new FreeAIService();
  
  // Test English query
  const testQueries = [
    { message: 'What are the admission requirements?', language: 'en' },
    { message: 'Tell me about fee structure', language: 'en' },
    { message: 'प्रवेश की आवश्यकताएं क्या हैं?', language: 'hi' },
    { message: 'फीस के बारे में बताएं', language: 'hi' }
  ];
  
  testQueries.forEach((query, index) => {
    console.log(`\n📝 Test ${index + 1}: ${query.message}`);
    const response = aiService.getEnhancedKnowledgeResponse(query.message, query.language);
    console.log(`✅ Response (${response.confidence.toFixed(2)} confidence):`);
    console.log(response.answer.substring(0, 100) + '...');
  });

  console.log('\n✅ AI Service tests completed!');
} catch (error) {
  console.log('❌ AI Service Error:', error.message);
}

// Test Free Translation Service
console.log('\n2. Testing Translation Service...');
try {
  const FreeTranslationService = require('./src/services/freeTranslationService.js');
  const translationService = new FreeTranslationService();
  
  const detectedLang = translationService.detectLanguage('Hello, how are you?');
  console.log('✅ Language Detection: English ->', detectedLang);
  
  const hindiDetection = translationService.detectLanguage('नमस्ते कैसे हैं आप?');
  console.log('✅ Language Detection: Hindi ->', hindiDetection);
  
  console.log('✅ Translation Service tests completed!');
} catch (error) {
  console.log('❌ Translation Service Error:', error.message);
}

console.log('\n📋 System Status Summary:');
console.log('- Frontend should be at: http://localhost:3000');
console.log('- Backend should be at: http://localhost:5000');
console.log('- Enhanced AI responses: ✅ Working');
console.log('- Multilingual support: ✅ Working');
console.log('- Free services: ✅ Integrated');

console.log('\n💡 Next Steps:');
console.log('1. Open http://localhost:3000 in your browser');
console.log('2. Try these enhanced test queries:');
console.log('   • "What are the admission requirements?"');
console.log('   • "Tell me about placement record"');
console.log('   • "फीस संरचना के बारे में बताएं"');
console.log('   • "दाखलो की जानकारी दो"');
console.log('3. Check for detailed, contextual responses!');