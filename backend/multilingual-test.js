console.log('🔍 Testing Multilingual Responses...\n');

// Import our enhanced AI service
const FreeAIService = require('./src/services/freeAIService');
const freeAI = new FreeAIService();

async function testLanguageResponses() {
  const testQueries = [
    // English
    { query: "Tell me about hostel facilities", lang: "en", expected: "hostel" },
    { query: "What about admission requirements?", lang: "en", expected: "admission" },
    { query: "Fee structure information", lang: "en", expected: "fees" },
    
    // Hindi
    { query: "हॉस्टल की सुविधाओं के बारे में बताएं", lang: "hi", expected: "hostel" },
    { query: "प्रवेश की आवश्यकताएं क्या हैं?", lang: "hi", expected: "admission" },
    { query: "फीस संरचना के बारे में बताएं", lang: "hi", expected: "fees" },
    
    // Rajasthani
    { query: "हॉस्टल की सुविधावां के बारे में बताओ", lang: "raj", expected: "hostel" },
    { query: "दाखले की जानकारी दो", lang: "raj", expected: "admission" },
    { query: "फीस के बारे में बताओ", lang: "raj", expected: "fees" }
  ];

  console.log('Testing Enhanced Knowledge Responses:\n');

  for (const test of testQueries) {
    try {
      const response = await freeAI.generateEnhancedResponse(test.query, test.lang, test.expected);
      
      console.log(`📝 Query (${test.lang.toUpperCase()}): ${test.query}`);
      console.log(`✅ Response (confidence: ${response.confidence}):`);
      console.log(`${response.answer.substring(0, 100)}...`);
      console.log(`📊 Source: ${response.source}`);
      console.log(`🎯 Category: ${response.category || 'N/A'}`);
      console.log(`🌐 Language: ${response.language}`);
      console.log('---\n');
      
    } catch (error) {
      console.log(`❌ Error testing "${test.query}":`, error.message);
    }
  }
}

testLanguageResponses().then(() => {
  console.log('✅ Multilingual testing completed!');
}).catch(error => {
  console.error('❌ Testing failed:', error);
});