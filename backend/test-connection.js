/**
 * Test script to verify backend connection and AI services
 */

const axios = require('axios');

async function testBackendConnection() {
  console.log('🔍 Testing backend connection...\n');

  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/health');
    console.log('✅ Health check:', healthResponse.data.message);
    
    // Test chat endpoint
    console.log('\n2. Testing chat endpoint...');
    const chatResponse = await axios.post('http://localhost:5000/api/chat/send', {
      message: 'What are the admission requirements?',
      language: 'en',
      sessionId: 'test-session-' + Date.now()
    });
    console.log('✅ Chat response:', chatResponse.data.botResponse.content.substring(0, 100) + '...');
    
    // Test multilingual
    console.log('\n3. Testing Hindi language...');
    const hindiResponse = await axios.post('http://localhost:5000/api/chat/send', {
      message: 'फीस संरचना के बारे में बताएं',
      language: 'hi', 
      sessionId: 'test-session-hindi-' + Date.now()
    });
    console.log('✅ Hindi response:', hindiResponse.data.botResponse.content.substring(0, 100) + '...');
    
    console.log('\n🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend server is not running!');
      console.log('💡 Make sure to start the backend with: npm run dev');
    } else {
      console.log('❌ Error:', error.response?.data || error.message);
    }
  }
}

async function testFreeAIService() {
  console.log('\n🤖 Testing Free AI Service...\n');
  
  try {
    const FreeAIService = require('./src/services/freeAIService.js');
    const aiService = new FreeAIService();
    
    console.log('1. Testing fallback response...');
    const response1 = await aiService.generateResponse('Hello', 'en');
    console.log('✅ AI Response:', response1);
    
    console.log('\n2. Testing FAQ matching...');
    const response2 = await aiService.generateResponse('What is the fee structure?', 'en');
    console.log('✅ Fee Query Response:', response2);
    
    console.log('\n3. Testing sentiment analysis...');
    const sentiment = await aiService.analyzeSentiment('I love this college!');
    console.log('✅ Sentiment:', sentiment);
    
    console.log('\n🎉 Free AI Service is working!');
    
  } catch (error) {
    console.log('❌ AI Service Error:', error.message);
  }
}

// Run tests
async function runAllTests() {
  await testBackendConnection();
  await testFreeAIService();
  
  console.log('\n📋 SUMMARY:');
  console.log('- Frontend should be running on: http://localhost:3000');
  console.log('- Backend should be running on: http://localhost:5000');
  console.log('- Test the chat at: http://localhost:3000');
  console.log('\n💡 If you see connection issues:');
  console.log('1. Make sure MongoDB is connected (check backend logs)');
  console.log('2. Restart both frontend and backend servers');
  console.log('3. Clear browser cache and reload');
}

runAllTests();