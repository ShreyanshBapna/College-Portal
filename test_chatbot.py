#!/usr/bin/env python3

import requests
import json

def test_chatbot():
    url = "http://localhost:5001/chat"
    
    # Test messages
    test_messages = [
        "What are the admission requirements for CSE?",
        "What are the fees for B.Tech?",
        "Tell me about placement statistics",
        "What courses are available?",
        "hostel fees kitne hai?"  # Hindi test
    ]
    
    print("🧪 Testing Enhanced JECRC Chatbot...")
    print("=" * 50)
    
    for i, message in enumerate(test_messages, 1):
        try:
            response = requests.post(url, 
                                   json={"message": message},
                                   headers={"Content-Type": "application/json"},
                                   timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"Test {i}: {message}")
                print(f"Response: {data.get('response', 'No response')}")
                print(f"Language: {data.get('language', 'Unknown')}")
                print(f"Intent: {data.get('intent', 'Unknown')}")
                print(f"🎯 Confidence: {data.get('confidence', 'N/A')}%")
                print("-" * 40)
            else:
                print(f"Test {i} Failed: Status {response.status_code}")
                print(f"Error: {response.text}")
                print("-" * 40)
                
        except requests.exceptions.RequestException as e:
            print(f"Test {i} Error: {e}")
            print("-" * 40)

if __name__ == "__main__":
    test_chatbot()