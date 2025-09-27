#!/usr/bin/env python3

import requests
import json

def test_fixes():
    url = "http://localhost:5001/chat"
    
    # Test cases to verify fixes
    test_cases = [
        {
            "message": "दाखले की जरूरत क्या सै?", 
            "description": "Rajasthani admission query",
            "expected_lang": "raj"
        },
        {
            "message": "प्रवेश की आवश्यकताएं क्या हैं?", 
            "description": "Hindi admission query", 
            "expected_lang": "hi"
        },
        {
            "message": "What are the admission requirements?", 
            "description": "English admission query",
            "expected_lang": "en"
        }
    ]
    
    print("🔧 Testing Fixes: Confidence & Language Differentiation")
    print("=" * 60)
    
    for i, test in enumerate(test_cases, 1):
        try:
            response = requests.post(url, 
                                   json={"message": test["message"]},
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                print(f"Test {i}: {test['description']}")
                print(f"Message: {test['message']}")
                print(f"Expected Lang: {test['expected_lang']}")
                print(f"Detected Lang: {data.get('language', 'Unknown')}")
                
                confidence = data.get('confidence', 0)
                print(f"🎯 Confidence: {confidence}%", end=" ")
                
                if confidence > 100:
                    print("❌ BUG: Confidence > 100%")
                elif confidence >= 90:
                    print("✅ Perfect!")
                elif confidence >= 80:
                    print("⚠️  Good")
                else:
                    print("❌ Too Low")
                
                print(f"Intent: {data.get('intent', 'Unknown')}")
                print(f"Response Preview: {data.get('response', '')[:80]}...")
                
                print("-" * 50)
            else:
                print(f"❌ Test {i} Failed: Status {response.status_code}")
                print("-" * 50)
                
        except Exception as e:
            print(f"❌ Test {i} Error: {e}")
            print("-" * 50)

if __name__ == "__main__":
    test_fixes()