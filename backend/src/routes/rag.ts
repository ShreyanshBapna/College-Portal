import express from 'express';
import { flaskRAGService } from '../services/flaskRAGService';
import { logger } from '../utils/logger';

const router = express.Router();

// @route   GET /api/rag/health
// @desc    Check Flask RAG service health
// @access  Public
router.get('/health', async (req, res) => {
  try {
    const health = await flaskRAGService.getFlaskHealth();
    res.json({
      status: 'success',
      flask_rag_service: health,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    logger.error('RAG health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to check RAG service health',
      error: error.message
    });
  }
});

// @route   POST /api/rag/chat
// @desc    Direct chat with Flask RAG service (for testing)
// @access  Public
router.post('/chat', async (req, res) => {
  try {
    const { message, user_id, language } = req.body;

    if (!message) {
      return res.status(400).json({
        status: 'error',
        message: 'Message is required'
      });
    }

    const response = await flaskRAGService.sendMessageToRAG(
      message,
      user_id || 'test-user',
      language || 'en'
    );

    res.json({
      status: 'success',
      data: response,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    logger.error('RAG chat error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to process chat with RAG service',
      error: error.message
    });
  }
});

export default router;