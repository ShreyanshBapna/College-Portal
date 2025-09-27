import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { connectDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './utils/logger';

// Route imports
import chatRoutes from './routes/chat';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';
import authRoutes from './routes/authRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import profileRoutes from './routes/profile';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 120000, // Increased to 2 minutes
  pingInterval: 60000,  // Increased to 1 minute
  connectTimeout: 60000,
  transports: ['websocket', 'polling'],
  allowEIO3: true,
  upgradeTimeout: 30000,
  maxHttpBufferSize: 1e6,
  serveClient: false
});

const PORT = process.env.PORT || 5000;

// Rate limiting (more permissive for development)
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '300'), // Increased to 300 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and certain endpoints
    return req.path === '/health' || req.path.startsWith('/api/chat/session');
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) }}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'SIH Multilingual Chatbot Backend is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/user-auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/profile', profileRoutes);

// Socket.IO for real-time chat with enhanced connection handling
io.on('connection', (socket) => {
  logger.info(`✅ User connected: ${socket.id} from ${socket.handshake.address}`);

  // Send welcome message with connection confirmation
  socket.emit('welcome', {
    message: 'Connected to JECRC Foundation Chat Assistant',
    timestamp: new Date().toISOString(),
    socketId: socket.id
  });

  socket.on('join_chat', (data) => {
    try {
      socket.join(data.sessionId);
      logger.info(`👥 User ${socket.id} joined chat session: ${data.sessionId}`);
      
      // Confirm joining
      socket.emit('joined_chat', {
        sessionId: data.sessionId,
        message: 'You are now connected to the chat!',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Error joining chat for ${socket.id}:`, error);
      socket.emit('error', { message: 'Failed to join chat session' });
    }
  });

  socket.on('send_message', async (data) => {
    try {
      logger.info(`📨 Processing message from ${socket.id}: ${data.message}`);
      
      // Process message through chat service
      const { processMessage } = await import('./services/chatService');
      const response = await processMessage(data.message, data.language, data.sessionId);
      
      // Send response back to user
      const responseData = {
        ...response,
        timestamp: new Date().toISOString(),
        sessionId: data.sessionId
      };
      
      socket.emit('receive_message', responseData);
      socket.to(data.sessionId).emit('receive_message', responseData);
      
      logger.info(`✅ Message processed successfully for session: ${data.sessionId}`);
    } catch (error) {
      logger.error('❌ Socket message error:', error);
      socket.emit('error', { 
        message: 'Error processing message',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Enhanced ping/pong handling
  socket.on('ping', (callback) => {
    logger.debug(`🏓 Ping received from ${socket.id}`);
    if (callback) callback('pong');
  });

  // Connection health check
  socket.on('health_check', (callback) => {
    if (callback) {
      callback({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    }
  });

  // College Management Real-time Events
  socket.on('join_dashboard', (data) => {
    try {
      const { userId, role, department } = data;
      socket.join(`user_${userId}`);
      socket.join(`role_${role}`);
      if (department) socket.join(`dept_${department}`);
      
      logger.info(`🎓 User ${socket.id} joined dashboard: role=${role}, dept=${department || 'N/A'}`);
      
      socket.emit('dashboard_joined', {
        message: 'Connected to real-time dashboard updates',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error(`Error joining dashboard for ${socket.id}:`, error);
      socket.emit('error', { message: 'Failed to join dashboard' });
    }
  });

  // Attendance real-time updates
  socket.on('mark_attendance', async (data) => {
    try {
      const { studentId, courseId, status, teacherId } = data;
      
      // Emit to relevant users
      socket.to(`user_${studentId}`).emit('attendance_updated', {
        courseId,
        status,
        timestamp: new Date().toISOString(),
        message: `Attendance marked as ${status}`
      });
      
      // Notify teacher
      socket.to(`user_${teacherId}`).emit('attendance_recorded', {
        studentId,
        courseId,
        status,
        timestamp: new Date().toISOString()
      });
      
      logger.info(`📋 Attendance marked: student=${studentId}, course=${courseId}, status=${status}`);
    } catch (error) {
      logger.error('Attendance marking error:', error);
      socket.emit('error', { message: 'Failed to mark attendance' });
    }
  });

  // Assignment and notification events
  socket.on('new_assignment', (data) => {
    try {
      const { courseId, assignment, studentIds } = data;
      
      // Notify all students in the course
      studentIds.forEach((studentId: string) => {
        socket.to(`user_${studentId}`).emit('assignment_notification', {
          ...assignment,
          timestamp: new Date().toISOString(),
          type: 'new_assignment'
        });
      });
      
      logger.info(`📚 New assignment distributed: ${assignment.title} to ${studentIds.length} students`);
    } catch (error) {
      logger.error('Assignment notification error:', error);
    }
  });

  // Announcement broadcasting
  socket.on('broadcast_announcement', (data) => {
    try {
      const { announcement, targetRoles, department } = data;
      
      if (targetRoles.includes('all')) {
        io.emit('announcement', {
          ...announcement,
          timestamp: new Date().toISOString()
        });
      } else {
        targetRoles.forEach((role: string) => {
          if (department) {
            socket.to(`dept_${department}`).emit('announcement', {
              ...announcement,
              timestamp: new Date().toISOString()
            });
          } else {
            socket.to(`role_${role}`).emit('announcement', {
              ...announcement,
              timestamp: new Date().toISOString()
            });
          }
        });
      }
      
      logger.info(`📢 Announcement broadcasted: ${announcement.title}`);
    } catch (error) {
      logger.error('Announcement broadcast error:', error);
    }
  });

  // Grade/Result updates
  socket.on('grade_updated', (data) => {
    try {
      const { studentId, courseId, grade, teacherId } = data;
      
      socket.to(`user_${studentId}`).emit('grade_notification', {
        courseId,
        grade,
        timestamp: new Date().toISOString(),
        message: 'Your grade has been updated'
      });
      
      logger.info(`📊 Grade updated: student=${studentId}, course=${courseId}, grade=${grade}`);
    } catch (error) {
      logger.error('Grade update error:', error);
    }
  });

  // Fee payment notifications
  socket.on('fee_payment', (data) => {
    try {
      const { studentId, amount, status, transactionId } = data;
      
      socket.to(`user_${studentId}`).emit('payment_notification', {
        amount,
        status,
        transactionId,
        timestamp: new Date().toISOString(),
        message: status === 'success' ? 'Payment processed successfully' : 'Payment failed'
      });
      
      // Notify admin/accounts department
      socket.to('role_admin').emit('payment_update', {
        studentId,
        amount,
        status,
        transactionId,
        timestamp: new Date().toISOString()
      });
      
      logger.info(`💳 Fee payment: student=${studentId}, amount=${amount}, status=${status}`);
    } catch (error) {
      logger.error('Fee payment notification error:', error);
    }
  });

  // Live class/meeting events
  socket.on('join_live_class', (data) => {
    try {
      const { classId, userId, userRole } = data;
      socket.join(`class_${classId}`);
      
      socket.to(`class_${classId}`).emit('user_joined_class', {
        userId,
        userRole,
        timestamp: new Date().toISOString()
      });
      
      logger.info(`🎥 User joined live class: ${userId} in class ${classId}`);
    } catch (error) {
      logger.error('Live class join error:', error);
    }
  });

  socket.on('leave_live_class', (data) => {
    try {
      const { classId, userId } = data;
      socket.leave(`class_${classId}`);
      
      socket.to(`class_${classId}`).emit('user_left_class', {
        userId,
        timestamp: new Date().toISOString()
      });
      
      logger.info(`🎥 User left live class: ${userId} from class ${classId}`);
    } catch (error) {
      logger.error('Live class leave error:', error);
    }
  });

  socket.on('disconnect', (reason) => {
    logger.info(`❌ User disconnected: ${socket.id}, reason: ${reason}`);
    
    // Clean up any session-specific data if needed
    socket.rooms.forEach(room => {
      if (room !== socket.id) {
        socket.leave(room);
      }
    });
  });

  socket.on('error', (error: any) => {
    logger.error(`🚨 Socket error for ${socket.id}:`, error);
  });

  // Handle connection errors
  socket.on('connect_error', (error: any) => {
    logger.error(`🔌 Connection error for ${socket.id}:`, error);
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start server
async function startServer() {
  try {
    await connectDatabase();
    server.listen(PORT, () => {
      logger.info(`🚀 SIH Multilingual Chatbot Backend running on port ${PORT}`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export { app, io };
