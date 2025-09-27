# Saarthi - JECRC Chatbot - AI Coding Instructions

## Project Overview
This is a **SIH 2025 competition project** - Saarthi, a multilingual chatbot for JECRC Foundation that handles campus queries in English, Hindi, and Rajasthani. Built with React + TypeScript frontend and Node.js + Express backend, with MongoDB for persistence and Socket.IO for real-time chat.

## Key Architecture Patterns

### Multilingual Support Architecture
- **Language Detection**: `backend/src/services/languageService.ts` uses heuristic detection (Devanagari script, keyword matching)
- **Translation Service**: `backend/src/services/translationService.ts` provides basic dictionary-based translation with external API fallback
- **Chat Processing**: `backend/src/services/chatService.ts` orchestrates language detection → intent extraction → FAQ matching → response translation

### Real-time Communication Flow
- Frontend establishes Socket.IO connection on session creation
- User messages flow: React component → Socket.IO → Express → Chat service → MongoDB → Socket.IO → React
- HTTP API serves as fallback when Socket.IO unavailable

### Data Models Structure
- **ChatSession**: Tracks language preference, session state, and metadata
- **Message**: Stores all chat messages with language, intent, and confidence metadata  
- **FAQ**: Multilingual knowledge base with category-based organization
- **Admin**: Basic admin user management

## Essential Development Workflows

### Adding New FAQ Categories
1. Update category enum in `backend/src/models/FAQ.ts`
2. Add intent mapping in `backend/src/services/chatService.ts` `extractIntentAndEntities()`
3. Create sample FAQs in `backend/src/scripts/seedFAQs.ts`
4. Add quick action buttons in `frontend/src/components/ChatInput.tsx` `getQuickActions()`

### Language Support Extension
1. Add language code to `frontend/src/types/chat.ts` Language type
2. Update detection patterns in `backend/src/services/languageService.ts`
3. Add translation mappings in `backend/src/services/translationService.ts`
4. Include language in `frontend/src/components/LanguageSelector.tsx` options

### API Route Development
- Follow pattern: `asyncHandler` wrapper → validation → business logic → response
- Use `backend/src/middleware/errorHandler.ts` AppError class for consistent error handling
- Socket.IO events handled in `backend/src/index.ts` with error boundaries

## Critical Configuration Points

### Environment Setup
- Backend requires MongoDB connection (`MONGODB_URI`)
- Frontend needs backend URL (`REACT_APP_BACKEND_URL`) 
- JWT secret must be set for admin authentication
- CORS configured for `FRONTEND_URL` environment variable

### Database Initialization
```bash
cd backend && npm run seed  # Populates FAQ collection with sample data
```

### Development Servers
- Backend: `npm run dev` (nodemon with TypeScript compilation)
- Frontend: `npm start` (Create React App dev server)
- Ensure MongoDB is running locally or configure cloud connection

## Code Conventions

### TypeScript Patterns
- Strict typing enabled - avoid `any` types
- Interface definitions in `frontend/src/types/` and inline for backend
- Use `asyncHandler` wrapper for all Express route handlers
- Socket.IO event handlers include proper error catching

### Component Architecture  
- React components follow container/presentation pattern
- Shared UI components in `frontend/src/components/`
- API services in `frontend/src/services/` with axios interceptors
- Chat state managed in `ChatApp.tsx` with props drilling (consider Context API for complex state)

### Backend Service Layer
- Route handlers delegate to service functions
- Services handle business logic and database operations
- Middleware for cross-cutting concerns (auth, validation, logging)
- Utility functions in `backend/src/utils/`

## Integration & External Dependencies

### Socket.IO Real-time Setup
- Connection established in `ChatApp.tsx` useEffect
- Events: `join_chat`, `send_message`, `receive_message`, `error`
- Graceful fallback to HTTP API when Socket.IO fails

### MongoDB Integration
- Mongoose schemas with validation and indexes
- Aggregation pipelines for analytics in `routes/analytics.ts`
- Text search indexes on FAQ collection for keyword matching

### Translation Service Integration
- Basic dictionary in `translationService.ts` for common phrases
- Placeholder for external API integration (Google Translate, Azure)
- Language-specific font handling with Tailwind CSS classes

## Performance & Scalability Considerations

### Frontend Optimization
- Tailwind CSS for consistent styling without runtime overhead
- React hot toast for non-blocking notifications
- Message virtualization needed for long chat histories

### Backend Optimization  
- Express rate limiting configured per environment
- MongoDB indexes on frequently queried fields (language, timestamp, sessionId)
- Winston logging with file rotation for production

## Testing & Deployment Notes

### Development Testing
- Backend has basic error boundaries and validation
- Frontend includes TypeScript strict checking
- Manual testing workflow: Create session → Send multilingual messages → Verify responses

### Production Considerations
- Environment variables must be configured for all services
- MongoDB connection pooling configured in `config/database.ts`
- CORS settings restrict to known frontend domains
- JWT secrets and database credentials require secure storage

When working on this codebase, focus on the multilingual user experience and ensure all new features work across the three supported languages (English, Hindi, Rajasthani).