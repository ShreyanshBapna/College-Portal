#!/usr/bin/env python3

import requests
import json

def test_language_fixes():
    """Test the language-specific response fixes"""
    
    print("🧪 Testing Language-Specific Response Fixes")
    print("=" * 55)
    
    test_cases = [
        {
            "message": "कोर्स फीस के बारे में बताएं",
            "expected_intent": "fees",
            "expected_language": "hi",
            "description": "Hindi course fee query"
        },
        {
            "message": "कोर्स फीस के बारे में बताओ", 
            "expected_intent": "fees",
            "expected_language": "raj",
            "description": "Rajasthani course fee query"
        },
        {
            "message": "course fees information",
            "expected_intent": "fees", 
            "expected_language": "en",
            "description": "English course fee query"
        },
        {
            "message": "engineering branches",
            "expected_intent": "courses",
            "expected_language": "en", 
            "description": "English courses query"
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
                print(f"🌐 Language: {data.get('language')} (expected: {test['expected_language']})")
                print(f"📊 Confidence: {data.get('confidence')}%")
                
                # Check intent
                if data.get('intent') == test['expected_intent']:
                    print("✅ Intent Detection: CORRECT")
                else:
                    print(f"❌ Intent Detection: WRONG")
                
                # Check language
                if data.get('language') == test['expected_language']:
                    print("✅ Language Detection: CORRECT") 
                else:
                    print(f"❌ Language Detection: WRONG")
                
                # Check if response is in correct language
                response_text = data.get('response', '')
                
                if test['expected_language'] == 'hi' and any(word in response_text for word in ['फीस', 'वार्षिक', 'प्रति वर्ष']):
                    print("✅ Response Language: CORRECT (Hindi)")
                elif test['expected_language'] == 'raj' and any(word in response_text for word in ['म्हैं', 'सै', 'मिलेगो']):
                    print("✅ Response Language: CORRECT (Rajasthani)")
                elif test['expected_language'] == 'en' and 'per year' in response_text:
                    print("✅ Response Language: CORRECT (English)")
                else:
                    print("❌ Response Language: WRONG")
                    
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 55)
    print("🎉 Language fix test completed!")

if __name__ == "__main__":
    test_language_fixes()