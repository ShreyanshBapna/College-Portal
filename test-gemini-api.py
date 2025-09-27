#!/usr/bin/env python3
"""
Simple script to test Gemini API key functionality
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

def test_gemini_api():
    # Load environment variables
    load_dotenv('chatbot-service/.env')
    
    # Get API key
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        return False
    
    print(f"🔑 API Key found: {api_key[:10]}...{api_key[-4:]}")
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Test with the updated model name
        print("🧪 Testing with gemini-1.5-flash model...")
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Simple test prompt
        test_prompt = "Hello! Please respond with 'API key is working correctly' if you can see this message."
        
        print("📤 Sending test message...")
        response = model.generate_content(test_prompt)
        
        print("📥 Response received:")
        print(f"✅ {response.text}")
        
        # Test JECRC-specific prompt
        print("\n🎓 Testing JECRC-specific prompt...")
        jecrc_prompt = "You are Saarthi, the JECRC Foundation chatbot. Tell me about JECRC Foundation in 2-3 lines."
        
        jecrc_response = model.generate_content(jecrc_prompt)
        print("🏫 JECRC Response:")
        print(f"✅ {jecrc_response.text}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing API: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Gemini API Key...")
    print("=" * 50)
    
    success = test_gemini_api()
    
    print("=" * 50)
    if success:
        print("🎉 Gemini API Key is working correctly!")
        print("✅ Ready to use with Saarthi chatbot")
    else:
        print("💥 Gemini API Key test failed")
        print("❌ Please check your API key and try again")