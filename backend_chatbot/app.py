from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Simple chatbot responses for deployment
def get_simple_response(message):
    """Simple response function for deployment testing."""
    message = message.lower()
    
    if 'hello' in message or 'hi' in message:
        return "Hello! I'm your medical assistant. How can I help you today?"
    elif 'symptom' in message:
        return "I can help you understand symptoms. Please describe what you're experiencing."
    elif 'treatment' in message:
        return "I can provide general treatment information. What condition are you asking about?"
    elif 'medication' in message:
        return "I can help with medication information. What medication are you asking about?"
    elif 'insurance' in message:
        return "I can help with insurance policy questions. What would you like to know?"
    elif 'asthma' in message:
        return "Asthma is a chronic respiratory condition. Common symptoms include wheezing, shortness of breath, and chest tightness. Treatment includes inhalers and avoiding triggers."
    elif 'diabetes' in message:
        return "Diabetes affects blood sugar levels. Type 1 requires insulin, while Type 2 can be managed with diet, exercise, and medication."
    elif 'headache' in message:
        return "Headaches can have many causes. Common treatments include rest, hydration, and over-the-counter pain relievers. See a doctor if severe or persistent."
    else:
        return "I'm here to help with medical information. You can ask me about symptoms, treatments, medications, or insurance policies."

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests from the frontend."""
    try:
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
        
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({
                'response': 'Please provide a message.',
                'status': 'error'
            }), 400
        
        # Get response from chatbot
        bot_response = get_simple_response(user_message)
        
        return jsonify({
            'response': bot_response,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({
            'response': f'Sorry, I encountered an error: {str(e)}',
            'status': 'error'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'message': 'Medical Assistant Chatbot is running'
    })

@app.route('/api/capabilities', methods=['GET'])
def get_capabilities():
    """Get chatbot capabilities."""
    return jsonify({
        'capabilities': [
            'Disease and condition information',
            'Symptom analysis',
            'Treatment options',
            'Medication information',
            'Health insurance policy queries',
            'General health advice',
            'Conversational interactions'
        ],
        'data_sources': [
            'Medical conditions database',
            'Health insurance policies',
            'Conversation patterns'
        ]
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)
