import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../middleware/errorHandler';
import { Admin } from '../models/Admin';
import { logger } from '../utils/logger';

const router = express.Router();

// @desc    Register admin
// @route   POST /api/auth/register
// @access  Public (should be protected in production)
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  // Check if admin exists
  const existingAdmin = await Admin.findOne({ email });
  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      message: 'Admin already exists'
    });
  }

  // Hash password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create admin
  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword
  });

  // Generate JWT token
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
  const jwtExpire = process.env.JWT_EXPIRE || '24h';
  
  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    jwtSecret,
    { expiresIn: jwtExpire } as jwt.SignOptions
  );

  logger.info(`New admin registered: ${email}`);

  res.status(201).json({
    success: true,
    message: 'Admin registered successfully',
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email
    }
  });
}));

// @desc    Login admin
// @route   POST /api/auth/login
// @access  Public
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if admin exists
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Update last login
  admin.lastLogin = new Date();
  await admin.save();

  // Generate JWT token
  const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
  const jwtExpire = process.env.JWT_EXPIRE || '24h';
  
  const token = jwt.sign(
    { id: admin._id, email: admin.email },
    jwtSecret,
    { expiresIn: jwtExpire } as jwt.SignOptions
  );

  logger.info(`Admin logged in: ${email}`);

  res.json({
    success: true,
    message: 'Login successful',
    token,
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email
    }
  });
}));

// @desc    Get current admin
// @route   GET /api/auth/me
// @access  Private
router.get('/me', asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    const decoded = jwt.verify(token, jwtSecret) as any;
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    res.json({
      success: true,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
}));

export default router;