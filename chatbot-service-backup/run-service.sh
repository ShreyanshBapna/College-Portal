#!/bin/bash

# Saarthi Chatbot Service Runner
echo "🚀 Starting Saarthi Chatbot Service..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run ./setup.sh first"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please make sure it exists"
    exit 1
fi

# Activate virtual environment and start the service
echo "🔧 Activating virtual environment..."
source venv/bin/activate

echo "🌟 Starting Saarthi - JECRC Chatbot on port 5001..."
python app.py