#!/usr/bin/env python3
"""
Startup script for the Medical Chatbot Service
"""

import os
import sys
import subprocess
import time
from pathlib import Path

def check_dependencies():
    """Check if required Python packages are installed."""
    required_packages = ['flask', 'flask-cors', 'requests']
    missing_packages = []
    
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print(f"❌ Missing required packages: {', '.join(missing_packages)}")
        print("Please install them using: pip install " + " ".join(missing_packages))
        return False
    
    print("✅ All required packages are installed")
    return True

def check_data_files():
    """Check if required data files exist."""
    required_files = ['data.json', 'insurance_policies.json', 'conversation_data.json']
    missing_files = []
    
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing required data files: {', '.join(missing_files)}")
        return False
    
    print("✅ All required data files are present")
    return True

def start_chatbot():
    """Start the chatbot service."""
    print("🏥 Starting Medical Chatbot Service...")
    print("=" * 50)
    
    # Check dependencies
    if not check_dependencies():
        return False
    
    # Check data files
    if not check_data_files():
        return False
    
    print("\n🚀 Starting Flask server...")
    print("📡 Service will be available at: http://localhost:5001")
    print("🔗 API endpoint: http://localhost:5001/api/chat")
    print("💡 Press Ctrl+C to stop the server")
    print("=" * 50)
    
    try:
        # Import and run the Flask app directly
        from app import app
        port = int(os.environ.get('PORT', 5001))
        app.run(debug=False, host='0.0.0.0', port=port)
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return False
    
    return True

if __name__ == "__main__":
    # Change to the script directory
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    print("🏥 Medical Chatbot Service")
    print("=" * 50)
    
    success = start_chatbot()
    
    if not success:
        print("\n❌ Failed to start chatbot service")
        sys.exit(1)
    else:
        print("\n✅ Chatbot service stopped successfully") 