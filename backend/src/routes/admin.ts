import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ChatSession } from '../models/ChatSession';
import { Message } from '../models/Message';
import { FAQ } from '../models/FAQ';
import { logger } from '../utils/logger';

const router = express.Router();

// @desc    Get dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private
router.get('/dashboard', asyncHandler(async (req: Request, res: Response) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Get session statistics
  const totalSessions = await ChatSession.countDocuments();
  const activeSessions = await ChatSession.countDocuments({ isActive: true });
  const todaySessions = await ChatSession.countDocuments({ 
    startTime: { $gte: startOfDay } 
  });

  // Get message statistics
  const totalMessages = await Message.countDocuments();
  const todayMessages = await Message.countDocuments({ 
    timestamp: { $gte: startOfDay } 
  });

  // Get language distribution
  const languageStats = await ChatSession.aggregate([
    { $group: { _id: '$language', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Get popular FAQs
  const popularFAQs = await FAQ.find()
    .sort({ accessCount: -1 })
    .limit(5)
    .select('question answer language accessCount');

  // Get session duration average
  const completedSessions = await ChatSession.find({
    isActive: false,
    endTime: { $exists: true }
  });

  let averageSessionDuration = 0;
  if (completedSessions.length > 0) {
    const totalDuration = completedSessions.reduce((acc, session) => {
      const duration = session.endTime!.getTime() - session.startTime.getTime();
      return acc + duration;
    }, 0);
    averageSessionDuration = totalDuration / completedSessions.length;
  }

  res.json({
    success: true,
    analytics: {
      sessions: {
        total: totalSessions,
        active: activeSessions,
        today: todaySessions
      },
      messages: {
        total: totalMessages,
        today: todayMessages
      },
      languages: languageStats,
      popularFAQs,
      averageSessionDuration: Math.round(averageSessionDuration / 1000) // in seconds
    }
  });
}));

// @desc    Get all FAQs
// @route   GET /api/admin/faqs
// @access  Private
router.get('/faqs', asyncHandler(async (req: Request, res: Response) => {
  const { language, page = 1, limit = 20 } = req.query;

  const filter = language ? { language } : {};
  
  const faqs = await FAQ.find(filter)
    .sort({ accessCount: -1, createdAt: -1 })
    .limit(Number(limit) * Number(page))
    .skip((Number(page) - 1) * Number(limit));

  const totalFAQs = await FAQ.countDocuments(filter);

  res.json({
    success: true,
    faqs,
    pagination: {
      currentPage: Number(page),
      totalPages: Math.ceil(totalFAQs / Number(limit)),
      totalFAQs,
      hasNext: Number(page) * Number(limit) < totalFAQs,
      hasPrev: Number(page) > 1
    }
  });
}));

// @desc    Create new FAQ
// @route   POST /api/admin/faqs
// @access  Private
router.post('/faqs', asyncHandler(async (req: Request, res: Response) => {
  const { question, answer, language, keywords, category } = req.body;

  const faq = await FAQ.create({
    question,
    answer,
    language,
    keywords: keywords || [],
    category: category || 'general'
  });

  logger.info(`New FAQ created: ${faq._id}`);

  res.status(201).json({
    success: true,
    message: 'FAQ created successfully',
    faq
  });
}));

// @desc    Update FAQ
// @route   PUT /api/admin/faqs/:id
// @access  Private
router.put('/faqs/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { question, answer, language, keywords, category } = req.body;

  const faq = await FAQ.findByIdAndUpdate(
    id,
    { question, answer, language, keywords, category },
    { new: true, runValidators: true }
  );

  if (!faq) {
    return res.status(404).json({
      success: false,
      message: 'FAQ not found'
    });
  }

  logger.info(`FAQ updated: ${id}`);

  res.json({
    success: true,
    message: 'FAQ updated successfully',
    faq
  });
}));

// @desc    Delete FAQ
// @route   DELETE /api/admin/faqs/:id
// @access  Private
router.delete('/faqs/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const faq = await FAQ.findByIdAndDelete(id);

  if (!faq) {
    return res.status(404).json({
      success: false,
      message: 'FAQ not found'
    });
  }

  logger.info(`FAQ deleted: ${id}`);

  res.json({
    success: true,
    message: 'FAQ deleted successfully'
  });
}));

export default router;