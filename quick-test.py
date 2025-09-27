#!/usr/bin/env python3
"""
Lightweight test to check if quota has reset
"""

import os
import time
from dotenv import load_dotenv
import google.generativeai as genai

def quick_test():
    load_dotenv('chatbot-service/.env')
    api_key = os.getenv('GEMINI_API_KEY')
    
    try:
        genai.configure(api_key=api_key)
        
        # Try the lightest model first
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Very simple, short prompt to minimize token usage
        response = model.generate_content("Hi")
        
        print("✅ API Key is working! Response:", response.text)
        return True
        
    except Exception as e:
        if "quota" in str(e).lower():
            print("⏳ Quota still exceeded. Please wait or upgrade billing.")
            return False
        else:
            print(f"❌ Other error: {e}")
            return False

if __name__ == "__main__":
    print("🧪 Quick Gemini API Test...")
    quick_test()