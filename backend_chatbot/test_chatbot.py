#!/usr/bin/env python3
"""
Test script for the Medical Assistant Chatbot
"""

from chatbot import MedicalChatbot

def test_chatbot():
    """Test the chatbot with various inputs."""
    chatbot = MedicalChatbot()
    
    # Test cases
    test_cases = [
        "hello",
        "asthma",
        "diabetes",
        "what is asthma",
        "i have chest pain",
        "maternity coverage",
        "help",
        "goodbye"
    ]
    
    print("🏥 Medical Assistant Chatbot - Test Results\n")
    print("=" * 60)
    
    for i, test_input in enumerate(test_cases, 1):
        print(f"\n{i}. Input: '{test_input}'")
        print("-" * 40)
        
        try:
            response = chatbot.get_response(test_input)
            print(f"Response: {response[:200]}{'...' if len(response) > 200 else ''}")
        except Exception as e:
            print(f"Error: {e}")
        
        print("-" * 40)
    
    print("\n" + "=" * 60)
    print("✅ Testing completed!")

if __name__ == "__main__":
    test_chatbot() 