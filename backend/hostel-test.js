console.log('🏠 Testing Specific Hostel Queries...\n');

// Import our enhanced AI service
const FreeAIService = require('./src/services/freeAIService');
const freeAI = new FreeAIService();

async function testHostelQueries() {
  const hostelQueries = [
    // English hostel queries
    { query: "Tell me about hostel facilities", lang: "en" },
    { query: "What are the hostel fees?", lang: "en" },
    { query: "Do you have separate hostels for boys and girls?", lang: "en" },
    
    // Hindi hostel queries  
    { query: "हॉस्टल की सुविधाओं के बारे में बताएं", lang: "hi" },
    { query: "हॉस्टल की फीस कितनी है?", lang: "hi" },
    { query: "छात्रावास में क्या सुविधाएं हैं?", lang: "hi" },
    
    // Rajasthani hostel queries
    { query: "हॉस्टल की सुविधावां के बारे में बताओ", lang: "raj" },
    { query: "हॉस्टल की फीस कितनी सै?", lang: "raj" },
    { query: "छात्रावास में कै सुविधा सै?", lang: "raj" }
  ];

  console.log('Testing Hostel Specific Responses:\n');

  for (let i = 0; i < hostelQueries.length; i++) {
    const test = hostelQueries[i];
    try {
      const response = await freeAI.generateEnhancedResponse(test.query, test.lang, 'hostel');
      
      console.log(`🏠 Test ${i + 1} (${test.lang.toUpperCase()}): ${test.query}`);
      console.log(`✅ Response (confidence: ${response.confidence}):`);
      console.log(`${response.answer}`);
      console.log(`📊 Source: ${response.source}`);
      console.log(`🎯 Category: ${response.category || 'N/A'}`);
      console.log('━'.repeat(80));
      console.log('');
      
    } catch (error) {
      console.log(`❌ Error testing "${test.query}":`, error.message);
      console.log('');
    }
  }
}

testHostelQueries().then(() => {
  console.log('✅ Hostel testing completed!');
  console.log('\n🎉 All languages should now provide detailed, contextual responses instead of the same generic answer!');
}).catch(error => {
  console.error('❌ Testing failed:', error);
});