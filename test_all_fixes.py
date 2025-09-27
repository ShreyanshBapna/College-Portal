#!/usr/bin/env python3

import requests
import json

def test_all_fixes():
    """Test all the fixes we implemented"""
    
    print("🧪 Testing All JECRC Chatbot Fixes")
    print("=" * 50)
    
    test_cases = [
        {
            "message": "Scholarship information",
            "expected_intent": "scholarship",
            "language": "en",
            "description": "English scholarship query"
        },
        {
            "message": "छात्रवृत्ति की जानकारी",
            "expected_intent": "scholarship", 
            "language": "hi",
            "description": "Hindi scholarship query"
        },
        {
            "message": "छात्रवृत्ति के बारे में बताओ",
            "expected_intent": "scholarship",
            "language": "raj",
            "description": "Rajasthani scholarship query"
        },
        {
            "message": "लाइब्रेरी को समय?",
            "expected_intent": "library",
            "language": "raj",
            "description": "Rajasthani library timing query"
        },
        {
            "message": "Library timings",
            "expected_intent": "library",
            "language": "en", 
            "description": "English library timing query"
        }
    ]
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n🔸 Test {i}: {test['description']}")
        print(f"   Query: {test['message']}")
        
        try:
            response = requests.post(
                "http://localhost:5001/chat",
                json={"message": test['message'], "user_id": f"test_{i}"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                print(f"✅ Status: {data.get('status')}")
                print(f"🎯 Intent: {data.get('intent')} (expected: {test['expected_intent']})")
                print(f"🌐 Language: {data.get('language')} (expected: {test['language']})")
                print(f"📊 Confidence: {data.get('confidence')}%")
                print(f"💬 Response Length: {len(data.get('response', ''))}")
                
                # Check if intent matches
                if data.get('intent') == test['expected_intent']:
                    print("✅ Intent Detection: CORRECT")
                else:
                    print(f"❌ Intent Detection: WRONG")
                    
                # Check if it's not a fallback response
                response_text = data.get('response', '')
                if "I'm here to help with information about JECRC Foundation!" not in response_text:
                    print("✅ Response Quality: SPECIFIC (not fallback)")
                else:
                    print("❌ Response Quality: FALLBACK")
                    
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 All fix tests completed!")

if __name__ == "__main__":
    test_all_fixes()