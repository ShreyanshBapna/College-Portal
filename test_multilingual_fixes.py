#!/usr/bin/env python3

import requests
import json

def test_multilingual_library_hostel():
    """Test the multilingual library and hostel fixes"""
    
    print("🧪 Testing Multilingual Library & Hostel Fixes")
    print("=" * 55)
    
    test_cases = [
        {
            "message": "लाइब्रेरी का समय?",
            "expected_language": "hi",
            "expected_intent": "library",
            "description": "Hindi library timing query"
        },
        {
            "message": "लाइब्रेरी को समय?",
            "expected_language": "raj", 
            "expected_intent": "library",
            "description": "Rajasthani library timing query"
        },
        {
            "message": "हॉस्टल की सुविधावां",
            "expected_language": "raj",
            "expected_intent": "hostel", 
            "description": "Rajasthani hostel facilities query"
        },
        {
            "message": "हॉस्टल की सुविधाएं",
            "expected_language": "hi",
            "expected_intent": "hostel",
            "description": "Hindi hostel facilities query"
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
                
                # Check language-specific response content
                response_text = data.get('response', '')
                
                if test['expected_language'] == 'hi':
                    if any(word in response_text for word in ['पुस्तकालय', 'छात्रावास', 'सुविधाएं', 'समय']):
                        print("✅ Response Language: FIXED (Hindi)")
                    else:
                        print("❌ Response Language: Still English")
                elif test['expected_language'] == 'raj':
                    if any(word in response_text for word in ['म्हैं', 'को', 'सै', 'लड़कां', 'लड़कियां']):
                        print("✅ Response Language: FIXED (Rajasthani)")
                    else:
                        print("❌ Response Language: Still English")
                        
                # Show response preview
                preview = response_text[:80].replace('\n', ' ')
                print(f"   💬 Response: {preview}...")
                    
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 55)
    print("🎉 Multilingual library & hostel test completed!")

if __name__ == "__main__":
    test_multilingual_library_hostel()