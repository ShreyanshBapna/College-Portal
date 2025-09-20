import express, { Request, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { ChatSession } from '../models/ChatSession';
import { Message } from '../models/Message';

const router = express.Router();

// @desc    Get chat analytics
// @route   GET /api/analytics/chats
// @access  Public
router.get('/chats', asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, language } = req.query;

  // Build filter based on query parameters
  const filter: any = {};
  
  if (startDate || endDate) {
    filter.startTime = {};
    if (startDate) filter.startTime.$gte = new Date(startDate as string);
    if (endDate) filter.startTime.$lte = new Date(endDate as string);
  }

  if (language) {
    filter.language = language;
  }

  // Get session analytics
  const totalSessions = await ChatSession.countDocuments(filter);
  const activeSessions = await ChatSession.countDocuments({ ...filter, isActive: true });
  
  // Get language distribution
  const languageDistribution = await ChatSession.aggregate([
    { $match: filter },
    { $group: { _id: '$language', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Get daily session counts
  const dailyStats = await ChatSession.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
        sessions: { $sum: 1 },
        messages: { $sum: '$messageCount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get average session duration
  const sessionDurations = await ChatSession.aggregate([
    { 
      $match: { 
        ...filter, 
        isActive: false, 
        endTime: { $exists: true } 
      } 
    },
    {
      $project: {
        duration: { $subtract: ['$endTime', '$startTime'] }
      }
    },
    {
      $group: {
        _id: null,
        averageDuration: { $avg: '$duration' },
        totalSessions: { $sum: 1 }
      }
    }
  ]);

  res.json({
    success: true,
    analytics: {
      totalSessions,
      activeSessions,
      languageDistribution,
      dailyStats,
      averageSessionDuration: sessionDurations[0]?.averageDuration || 0
    }
  });
}));

// @desc    Get message analytics
// @route   GET /api/analytics/messages
// @access  Public
router.get('/messages', asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate, language } = req.query;

  const filter: any = {};
  
  if (startDate || endDate) {
    filter.timestamp = {};
    if (startDate) filter.timestamp.$gte = new Date(startDate as string);
    if (endDate) filter.timestamp.$lte = new Date(endDate as string);
  }

  if (language) {
    filter.language = language;
  }

  // Get message counts by sender
  const messageBySender = await Message.aggregate([
    { $match: filter },
    { $group: { _id: '$sender', count: { $sum: 1 } } }
  ]);

  // Get daily message counts
  const dailyMessages = await Message.aggregate([
    { $match: filter },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Get most common intents (from bot messages)
  const commonIntents = await Message.aggregate([
    { 
      $match: { 
        ...filter, 
        sender: 'bot', 
        'metadata.intent': { $exists: true } 
      } 
    },
    { $group: { _id: '$metadata.intent', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    success: true,
    analytics: {
      messageBySender,
      dailyMessages,
      commonIntents
    }
  });
}));

// @desc    Get user satisfaction analytics
// @route   GET /api/analytics/satisfaction
// @access  Public
router.get('/satisfaction', asyncHandler(async (req: Request, res: Response) => {
  const { startDate, endDate } = req.query;

  const filter: any = {};
  
  if (startDate || endDate) {
    filter.startTime = {};
    if (startDate) filter.startTime.$gte = new Date(startDate as string);
    if (endDate) filter.startTime.$lte = new Date(endDate as string);
  }

  // Get rating distribution
  const ratingDistribution = await ChatSession.aggregate([
    { $match: { ...filter, rating: { $exists: true } } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);

  // Get average rating
  const averageRating = await ChatSession.aggregate([
    { $match: { ...filter, rating: { $exists: true } } },
    { $group: { _id: null, average: { $avg: '$rating' } } }
  ]);

  // Get feedback sentiment (simplified analysis)
  const feedbackData = await ChatSession.find({
    ...filter,
    feedback: { $exists: true, $ne: '' }
  }).select('feedback rating');

  res.json({
    success: true,
    analytics: {
      ratingDistribution,
      averageRating: averageRating[0]?.average || 0,
      totalRatings: ratingDistribution.reduce((sum, item) => sum + item.count, 0),
      feedbackCount: feedbackData.length
    }
  });
}));

export default router;