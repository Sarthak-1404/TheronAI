from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'SmartHealth Chatbot API',
        'status': 'running',
        'endpoints': {
            'chat': '/api/chat',
            'health': '/api/health'
        }
    })

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
        
        # Simple response for now
        bot_response = f"Hello! I received your message: '{user_message}'. I'm your SmartHealth medical assistant chatbot. I'm here to help with medical information, symptoms, and health advice."
        
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
        'message': 'SmartHealth Chatbot is running'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port)
