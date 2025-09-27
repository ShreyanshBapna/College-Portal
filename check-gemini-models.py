#!/usr/bin/env python3
"""
Script to list available Gemini models for the API key
"""

import os
from dotenv import load_dotenv
import google.generativeai as genai

def list_available_models():
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
        
        print("📋 Listing available models...")
        print("=" * 60)
        
        # List all available models
        models = genai.list_models()
        
        generative_models = []
        for model in models:
            if 'generateContent' in model.supported_generation_methods:
                generative_models.append(model.name)
                print(f"✅ {model.name}")
                print(f"   Display Name: {model.display_name}")
                print(f"   Description: {model.description}")
                print("-" * 40)
        
        if generative_models:
            print(f"\n🎯 Found {len(generative_models)} models that support generateContent")
            print("\n🧪 Testing the first available model...")
            
            # Test with first available model
            test_model_name = generative_models[0]
            model = genai.GenerativeModel(test_model_name)
            
            test_prompt = "Hello! Please respond with 'API key is working correctly' if you can see this message."
            response = model.generate_content(test_prompt)
            
            print(f"✅ Test successful with {test_model_name}")
            print(f"📥 Response: {response.text}")
            
            return generative_models
        else:
            print("❌ No models found that support generateContent")
            return []
        
    except Exception as e:
        print(f"❌ Error listing models: {str(e)}")
        return []

if __name__ == "__main__":
    print("🚀 Checking Available Gemini Models...")
    print("=" * 50)
    
    models = list_available_models()
    
    print("=" * 50)
    if models:
        print("🎉 Gemini API Key is working!")
        print(f"✅ Available models: {len(models)}")
        print("🔧 Recommended model for your chatbot:", models[0])
    else:
        print("💥 Could not access Gemini models")
        print("❌ Please check your API key and try again")