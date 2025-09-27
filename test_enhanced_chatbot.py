#!/usr/bin/env python3

import requests
import json

def test_enhanced_chatbot():
    url = "http://localhost:5001/chat"
    
    # Test messages with Rajasthani and high confidence expectations
    test_messages = [
        {"message": "What are the admission requirements?", "expected_lang": "en"},
        {"message": "दाखले की जरूरत क्या सै?", "expected_lang": "raj"},
        {"message": "छात्रवृत्ति की जानकारी", "expected_lang": "raj"},
        {"message": "hostel fees kitne hai?", "expected_lang": "hi"},
        {"message": "फीस कितनी है?", "expected_lang": "hi"}
    ]
    
    print("🧪 Testing Enhanced JECRC Chatbot v2.0...")
    print("🎯 Expected: 90%+ Confidence & Rajasthani Support")
    print("=" * 60)
    
    for i, test_case in enumerate(test_messages, 1):
        message = test_case["message"]
        expected_lang = test_case["expected_lang"]
        
        try:
            response = requests.post(url, 
                                   json={"message": message},
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                print(f"Test {i}: {message}")
                print(f"Expected Language: {expected_lang}")
                print(f"Detected Language: {data.get('language', 'Unknown')}")
                print(f"🎯 Confidence: {data.get('confidence', 'N/A')}%")
                print(f"Intent: {data.get('intent', 'Unknown')}")
                print(f"Response Preview: {data.get('response', 'No response')[:100]}...")
                
                # Check confidence level
                confidence = data.get('confidence', 0)
                if confidence >= 90:
                    print("✅ HIGH CONFIDENCE ACHIEVED!")
                elif confidence >= 80:
                    print("⚠️  Good confidence (80-89%)")
                else:
                    print("❌ Low confidence (<80%)")
                    
                print("-" * 50)
            else:
                print(f"Test {i} Failed: Status {response.status_code}")
                print(f"Error: {response.text}")
                print("-" * 50)
                
        except requests.exceptions.RequestException as e:
            print(f"Test {i} Error: {e}")
            print("-" * 50)

if __name__ == "__main__":
    test_enhanced_chatbot()