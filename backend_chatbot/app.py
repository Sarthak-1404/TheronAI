from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import MedicalChatbot
import json

app = Flask(__name__)
CORS(app)

# Initialize the chatbot
chatbot = MedicalChatbot()

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests from the frontend."""
    try:
        print(f"Received request headers: {dict(request.headers)}")
        print(f"Received request data: {request.get_data()}")
        
        # Handle both JSON and form data
        if request.is_json:
            data = request.get_json()
        else:
            data = request.form.to_dict()
        
        print(f"Parsed data: {data}")
        
        user_message = data.get('message', '').strip()
        print(f"User message: {user_message}")
        
        if not user_message:
            return jsonify({
                'response': 'Please provide a message.',
                'status': 'error'
            }), 400
        
        # Get response from chatbot
        bot_response = chatbot.get_response(user_message)
        print(f"Bot response: {bot_response}")
        
        return jsonify({
            'response': bot_response,
            'status': 'success'
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
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
    app.run(debug=True, host='0.0.0.0', port=5001)
