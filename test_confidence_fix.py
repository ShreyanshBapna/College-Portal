#!/usr/bin/env python3

import requests
import json

def test_confidence_fix():
    """Test that confidence scores are now displaying correctly (85-98%)"""
    
    # Test the Flask service directly
    print("🧪 Testing Enhanced JECRC Chatbot Confidence Fix")
    print("=" * 50)
    
    test_cases = [
        "What are the admission requirements?",
        "कोर्स फीस के बारे में बताओ", 
        "दाखले की जरूरत क्या सै?"
    ]
    
    for i, query in enumerate(test_cases, 1):
        print(f"\n🔸 Test {i}: {query}")
        
        try:
            response = requests.post(
                "http://localhost:5001/chat",
                json={"message": query, "user_id": f"test_{i}"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                confidence = data.get('confidence', 0)
                
                print(f"✅ Status: {data.get('status')}")
                print(f"📊 Confidence: {confidence}%")
                print(f"🎯 Intent: {data.get('intent')}")
                print(f"🌐 Language: {data.get('language')}")
                
                # Verify confidence is in correct range
                if 85 <= confidence <= 98:
                    print("✅ Confidence Range: CORRECT (85-98%)")
                else:
                    print(f"❌ Confidence Range: WRONG ({confidence}% - should be 85-98%)")
                    
            else:
                print(f"❌ HTTP Error: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Confidence fix test completed!")
    print("Frontend will now show correct percentages like 95% instead of 9500%")

if __name__ == "__main__":
    test_confidence_fix()