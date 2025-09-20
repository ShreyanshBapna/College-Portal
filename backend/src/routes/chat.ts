import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ChatSession } from '../models/ChatSession';
import { Message } from '../models/Message';
import { processMessage } from '../services/chatService';
import { logger } from '../utils/logger';

const router = express.Router();

// @desc    Start new chat session
// @route   POST /api/chat/session
// @access  Public
router.post('/session', asyncHandler(async (req: Request, res: Response) => {
  const { language = 'en', userId } = req.body;

  const session = await ChatSession.create({
    userId: userId || null,
    language,
    isActive: true,
    startTime: new Date()
  });

  logger.info(`New chat session started: ${session._id}`);

  res.status(201).json({
    success: true,
    sessionId: session._id,
    language: session.language
  });
}));

// @desc    Send message to chatbot
// @route   POST /api/chat/message
// @access  Public
router.post('/message', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId, message, language = 'en' } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({
      success: false,
      message: 'Session ID and message are required'
    });
  }

  // Check if session exists
  const session = await ChatSession.findById(sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Chat session not found'
    });
  }

  // Save user message
  const userMessage = await Message.create({
    sessionId,
    content: message,
    language,
    sender: 'user',
    timestamp: new Date()
  });

  // Process message and get bot response
  const botResponse = await processMessage(message, language, sessionId);

  // Save bot response
  const botMessage = await Message.create({
    sessionId,
    content: botResponse.message,
    language: botResponse.language,
    sender: 'bot',
    timestamp: new Date(),
    metadata: {
      confidence: botResponse.confidence,
      intent: botResponse.intent,
      entities: botResponse.entities
    }
  });

  // Update session
  session.lastActivity = new Date();
  session.messageCount = (session.messageCount || 0) + 2;
  await session.save();

  logger.info(`Message processed in session: ${sessionId}`);

  res.json({
    success: true,
    userMessage: {
      id: userMessage._id,
      content: userMessage.content,
      timestamp: userMessage.timestamp
    },
    botResponse: {
      id: botMessage._id,
      content: botMessage.content,
      language: botMessage.language,
      confidence: botResponse.confidence,
      intent: botResponse.intent,
      timestamp: botMessage.timestamp
    }
  });
}));

// @desc    Get chat history
// @route   GET /api/chat/history/:sessionId
// @access  Public
router.get('/history/:sessionId', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const messages = await Message.find({ sessionId })
    .sort({ timestamp: 1 })
    .limit(Number(limit) * Number(page))
    .skip((Number(page) - 1) * Number(limit));

  const totalMessages = await Message.countDocuments({ sessionId });

  res.json({
    success: true,
    messages,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalMessages / Number(limit)),
      totalMessages,
      hasNext: Number(page) * Number(limit) < totalMessages,
      hasPrev: Number(page) > 1
    }
  });
}));

// @desc    End chat session
// @route   PUT /api/chat/session/:sessionId/end
// @access  Public
router.put('/session/:sessionId/end', asyncHandler(async (req: Request, res: Response) => {
  const { sessionId } = req.params;
  const { feedback, rating } = req.body;

  const session = await ChatSession.findById(sessionId);
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Chat session not found'
    });
  }

  session.isActive = false;
  session.endTime = new Date();
  session.feedback = feedback;
  session.rating = rating;
  await session.save();

  logger.info(`Chat session ended: ${sessionId}`);

  res.json({
    success: true,
    message: 'Chat session ended successfully'
  });
}));

// @desc    Get supported languages
// @route   GET /api/chat/languages
// @access  Public
router.get('/languages', (req: Request, res: Response) => {
  const supportedLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'raj', name: 'Rajasthani', nativeName: 'राजस्थानी' }
  ];

  res.json({
    success: true,
    languages: supportedLanguages
  });
});

export default router;