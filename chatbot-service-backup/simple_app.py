from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import logging

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3002"])  # Allow frontend access

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    logger.error("GEMINI_API_KEY not found in environment variables")
    exit(1)

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-pro')

class SaarthiChatbot:
    def __init__(self):
        self.system_prompt = """
        You are Saarthi, the official JECRC Foundation chatbot. You are knowledgeable about:
        
        JECRC FOUNDATION INFORMATION:
        - Located in Jaipur, Rajasthan, India
        - Offers Engineering, Management, and other professional courses
        - Departments: Computer Science, Information Technology, Electronics & Communication, Mechanical, Civil, etc.
        - Facilities: Modern campus, hostels, libraries, labs, sports facilities
        - Admissions through JEE Main, REAP, and management quota
        - Placement cell with good industry connections
        
        INSTRUCTIONS:
        - Always introduce yourself as Saarthi, the JECRC chatbot
        - Be helpful, professional, and friendly
        - Focus on JECRC-related queries
        - If asked about topics outside JECRC, politely redirect to JECRC-related information
        - Support multiple languages (English, Hindi, Rajasthani) when possible
        - Provide accurate, concise, and helpful responses
        """
        
        self.conversation_contexts = {}
    
    def generate_response(self, user_message, user_id="default", language="en"):
        try:
            # Create context-aware prompt
            full_prompt = f"""
            {self.system_prompt}
            
            User Language: {language}
            User ID: {user_id}
            User Message: {user_message}
            
            Please respond as Saarthi, the JECRC chatbot, in a helpful and informative manner.
            If the user is asking in Hindi or Rajasthani, try to respond in that language when appropriate.
            """
            
            # Generate response using Gemini
            response = model.generate_content(full_prompt)
            
            if response.text:
                return response.text.strip()
            else:
                return "I apologize, but I'm having trouble generating a response right now. Please try again."
                
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return "I'm experiencing some technical difficulties. Please try again in a moment."

# Initialize chatbot
saarthi = SaarthiChatbot()

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'service': 'Saarthi - JECRC Chatbot',
        'version': '1.0',
        'gemini_api': 'connected' if GEMINI_API_KEY else 'not configured'
    })

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        user_message = data.get('message', '').strip()
        user_id = data.get('user_id', 'default')
        language = data.get('language', 'en')
        
        if not user_message:
            return jsonify({'error': 'Empty message'}), 400
        
        logger.info(f"Received message from {user_id}: {user_message}")
        
        # Generate response
        response = saarthi.generate_response(user_message, user_id, language)
        
        return jsonify({
            'response': response,
            'status': 'success',
            'rag_enabled': False,  # For compatibility with backend service
            'source': 'gemini-pro',
            'language': language,
            'user_id': user_id
        })
        
    except Exception as e:
        logger.error(f"Chat endpoint error: {str(e)}")
        return jsonify({
            'response': 'I apologize, but I encountered an error processing your request. Please try again.',
            'status': 'error',
            'error': str(e)
        }), 500

@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'message': 'Saarthi - JECRC Chatbot API',
        'endpoints': {
            '/health': 'GET - Health check',
            '/chat': 'POST - Chat with Saarthi',
        },
        'version': '1.0'
    })

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    
    logger.info(f"🚀 Starting Saarthi - JECRC Chatbot on port {port}")
    logger.info(f"🔑 Gemini API configured: {'Yes' if GEMINI_API_KEY else 'No'}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)