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
model = genai.GenerativeModel('gemini-2.5-flash')  # Updated to working model

class SaarthiChatbot:
    def __init__(self):
        self.system_prompt = """
        You are Saarthi, the official JECRC Foundation chatbot. You are knowledgeable about:
        
        JECRC FOUNDATION COMPREHENSIVE INFORMATION:
        
        📍 LOCATION & CAMPUS:
        - Main Campus: Kukas, Jaipur, Rajasthan, India
        - Sprawling 40-acre modern campus with Wi-Fi connectivity
        - Well-planned infrastructure with green spaces and modern architecture
        
        🎓 ACADEMIC PROGRAMS:
        - B.Tech: Computer Science, IT, ECE, Mechanical, Civil, Electrical, Automobile
        - M.Tech: Various specializations available
        - MBA: Full-time and Executive programs
        - BBA, MCA, B.Sc, M.Sc programs
        - Ph.D. programs in multiple disciplines
        
        📚 LIBRARY FACILITIES:
        - Central Library: Open 8:00 AM to 8:00 PM (Monday-Saturday)
        - Digital Library: 24/7 access with online resources
        - Over 50,000+ books, journals, and digital resources
        - Separate reading halls for UG and PG students
        - Air-conditioned with comfortable seating for 200+ students
        - Access to IEEE, ACM, and other premium digital databases
        - Quiet study zones and group discussion areas
        
        🏠 HOSTEL FACILITIES:
        - Separate hostels for boys and girls
        - AC and Non-AC rooms available
        - Mess facilities with vegetarian and non-vegetarian options
        - 24/7 security and medical facilities
        - Recreation rooms with TV, indoor games
        - High-speed internet connectivity
        
        💰 FEES & SCHOLARSHIPS:
        - Merit-based scholarships for JEE Main toppers
        - Financial assistance for economically weaker students
        - Sports scholarships for outstanding athletes
        - Girl child scholarships and SC/ST concessions
        - Payment plans available with installment options
        
        🏆 PLACEMENTS:
        - 85%+ placement record consistently
        - Top recruiters: TCS, Infosys, Wipro, Cognizant, Amazon, Microsoft, Adobe
        - Average package: 4-6 LPA, Highest: 25+ LPA
        - Dedicated Training & Placement Cell
        - Industry partnerships and internship programs
        
        🔬 FACILITIES:
        - State-of-the-art laboratories for all departments
        - Research centers and innovation labs
        - Sports complex with cricket, football, basketball courts
        - Gymnasium and fitness center
        - Medical facilities with qualified staff
        - Transportation facility from major city points
        - Cafeteria and food courts with variety of options
        
        📞 CONTACT INFORMATION:
        - Admissions Office: Open 9:00 AM to 5:00 PM
        - Phone: +91-141-2770270, 2770271
        - Email: admissions@jecrc.ac.in
        - Website: www.jecrc.ac.in
        - Address: JECRC Foundation, Kukas, Jaipur-302028
        
        RESPONSE GUIDELINES:
        - Always introduce yourself as Saarthi, the JECRC Foundation chatbot
        - Provide specific, detailed, and actionable information
        - Use bullet points and structured formatting when helpful
        - Include relevant contact details when appropriate
        - If you don't have specific information, acknowledge it and provide general guidance
        - Be warm, professional, and student-friendly
        - Support queries in English, Hindi, and Rajasthani
        - Always end with "Is there anything else I can help you with regarding JECRC Foundation?"
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