#!/usr/bin/env python3

import requests
import json
from datetime import datetime

def test_enhanced_chatbot():
    """Test the enhanced chatbot service and verify fixes"""
    
    base_url = "http://localhost:5001"
    
    test_cases = [
        {
            "message": "What are the admission requirements?",
            "expected_intent": "admission",
            "language": "en"
        },
        {
            "message": "कोर्स फीस के बारे में बताओ",
            "expected_intent": "fees",
            "language": "hi"
        },
        {
            "message": "फीस के बारे में बताओ",
            "expected_intent": "fees",
            "language": "raj"
        }
    ]
    
    print("🧪 Testing Enhanced JECRC Chatbot Fixes")
    print("=" * 50)
    
    for i, test in enumerate(test_cases, 1):
        print(f"\n🔸 Test {i}: {test['message']}")
        
        try:
            response = requests.post(
                f"{base_url}/chat",
                json={
                    "message": test['message'],
                    "user_id": f"test_{i}"
                },
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                print(f"✅ Status: {data.get('status')}")
                print(f"🎯 Intent: {data.get('intent')}")
                print(f"🌐 Language: {data.get('language')}")
                print(f"📊 Confidence: {data.get('confidence')}%")
                print(f"💬 Response Length: {len(data.get('response', ''))}")
                print(f"📝 Response Preview: {data.get('response', '')[:100]}...")
                
                # Verify confidence is reasonable (85-98%)
                confidence = data.get('confidence', 0)
                if 85 <= confidence <= 98:
                    print("✅ Confidence Score: FIXED")
                else:
                    print(f"❌ Confidence Score: Still broken ({confidence}%)")
                
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                print(f"Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ Connection Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Test completed!")

if __name__ == "__main__":
    test_enhanced_chatbot()