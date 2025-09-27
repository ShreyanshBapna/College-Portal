#!/bin/bash

# Saarthi Chatbot Service Setup Script
echo "🚀 Setting up Saarthi Chatbot Service..."

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install requirements
echo "📥 Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Saarthi Chatbot Service setup complete!"
echo "🎯 To start the service, run: source venv/bin/activate && python app.py"