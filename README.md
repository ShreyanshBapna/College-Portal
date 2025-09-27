# Saarthi - JECRC Chatbot 🤖

A complete multilingual chatbot system for JECRC Foundation with AI-powered responses in English, Hindi, and Rajasthani.

## 🏗️ Architecture

```
College-Portal/
├── 🧠 chatbot-service/     # Flask AI service with Gemini integration
├── 🚀 backend/             # Express.js API server with Socket.IO
├── 💻 frontend/            # React TypeScript web interface
└── 📦 package.json         # Main project orchestration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.8+
- MongoDB connection

### 1️⃣ One-Command Setup
```bash
npm run setup
```
This installs all dependencies for all three services.

### 2️⃣ One-Command Start
```bash
npm run dev
```
This starts all three services simultaneously:
- 🧠 Chatbot Service (Port 5001) - Flask with Gemini AI
- 🚀 Backend API (Port 5002) - Express with Socket.IO  
- 💻 Frontend (Port 3000) - React development server

## 🔧 Individual Service Commands

### Chatbot Service (Flask + Gemini AI)
```bash
# Setup Python environment
npm run chatbot:setup

# Start chatbot service only
npm run chatbot:start
```

### Backend API (Express + Socket.IO)
```bash
# Start backend only
npm run dev:backend

# Seed database with FAQs
cd backend && npm run seed
```

### Frontend (React + TypeScript)
```bash
# Start frontend only  
npm run dev:frontend
```

## 🌐 Service URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5002
- **Chatbot Service**: http://localhost:5001

## 🔑 Environment Configuration

### Backend (.env)
```env
MONGODB_URI=your-mongodb-connection-string
FLASK_RAG_URL=http://localhost:5001
JWT_SECRET=your-jwt-secret
```

### Chatbot Service (.env)
```env
GOOGLE_API_KEY=your-gemini-api-key
PORT=5001
```

## 🧪 Features
- ✅ Multilingual support (English/Hindi/Rajasthani)
- ✅ Real-time chat via Socket.IO
- ✅ Google Gemini AI integration
- ✅ JECRC-specific knowledge base
- ✅ Responsive design
- ✅ Admin dashboard (planned)

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Clean All Services
```bash
npm run clean
```

### Lint All Code
```bash
npm run lint
```

## 📁 Project Structure
- `chatbot-service/` - Python Flask service with AI integration
- `backend/` - Node.js Express API with database and Socket.IO
- `frontend/` - React TypeScript web application
- `package.json` - Main orchestration and workspace management

## 🤝 Contributing
This is a SIH 2025 competition project. Contributions from team members welcome!

---
**Saarthi** - Your intelligent JECRC companion 🎓