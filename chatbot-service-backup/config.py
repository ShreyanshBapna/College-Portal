"""Configuration settings for JECRC Gemini Bot"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'jecrc-gemini-bot-secret-key'
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
    
    # Gemini API Configuration
    GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
    MODEL_NAME = os.environ.get('MODEL_NAME') or 'gemini-pro'
    
    # College Information
    COLLEGE_NAME = os.environ.get('COLLEGE_NAME') or 'JECRC University'
    COLLEGE_LOCATION = os.environ.get('COLLEGE_LOCATION') or 'Jaipur, Rajasthan'
    
    # Bot Configuration
    MAX_MESSAGE_LENGTH = 1000
    CONVERSATION_HISTORY_LIMIT = 10
    
    # JECRC-specific context for Gemini
    COLLEGE_CONTEXT = f"""
    You are an intelligent assistant for {COLLEGE_NAME} located in {COLLEGE_LOCATION}.
    
    IMPORTANT INFORMATION ABOUT JECRC:
    
    FEES:
    - B.Tech Annual Fee: ₹1,25,000
    - Hostel Fee (Non-AC): ₹80,000/year
    - Hostel Fee (AC): ₹1,20,000/year
    - Mess charges: ₹40,000/year
    
    ADMISSION:
    - Eligibility: 12th with PCM, 75% marks (65% for SC/ST)
    - Based on JEE Main or REAP scores
    - Online application at jecrc.edu
    - Application fee: ₹1,000
    
    COURSES OFFERED:
    - Computer Science Engineering (CSE) - Most popular
    - Information Technology (IT)
    - Electronics & Communication (ECE)
    - Mechanical Engineering
    - Civil Engineering
    - Electrical Engineering
    - MBA (2 years)
    - BBA (3 years)
    
    PLACEMENT STATISTICS:
    - Overall placement: 85%
    - Average package: ₹4.5 LPA
    - Highest package: ₹25 LPA
    - Top companies: TCS, Infosys, Wipro, Accenture, Amazon
    
    CONTACT:
    - Main Office: +91-141-2770000
    - Admission Helpline: +91-141-2770009
    - Email: info@jecrcu.edu.in
    - Address: Jaipur-Ramgarh Road, Sitapura Industrial Area, Jaipur - 303905
    
    FACILITIES:
    - Modern labs and equipment
    - 50,000+ books library
    - Hostel facilities for boys and girls
    - 24/7 WiFi
    - Sports complex
    - Canteen and mess facilities
    
    CONVERSATION GUIDELINES:
    - Be conversational, helpful, and friendly
    - Use a mix of Hindi and English naturally (like most Indian students)
    - Be honest about both positives and limitations
    - Provide detailed, practical advice
    - Ask follow-up questions to help better
    - Remember conversation context
    - Use examples and analogies to explain complex topics
    """

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get configuration based on environment"""
    env = os.environ.get('FLASK_ENV', 'development')
    return config.get(env, config['default'])