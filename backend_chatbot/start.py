#!/usr/bin/env python3
"""
Simple startup script for SmartHealth Chatbot
"""
import os
from app import app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    print(f"🚀 Starting SmartHealth Chatbot on port {port}")
    app.run(debug=False, host='0.0.0.0', port=port) 