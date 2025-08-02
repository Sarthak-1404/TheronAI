from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        'message': 'SmartHealth Chatbot API',
        'status': 'running'
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json() if request.is_json else request.form.to_dict()
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'response': 'Please provide a message.', 'status': 'error'}), 400
        
        bot_response = f"Hello! I received: '{user_message}'. I'm your SmartHealth medical assistant chatbot."
        
        return jsonify({
            'response': bot_response,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({'response': f'Error: {str(e)}', 'status': 'error'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'SmartHealth Chatbot is running'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=False, host='0.0.0.0', port=port) 