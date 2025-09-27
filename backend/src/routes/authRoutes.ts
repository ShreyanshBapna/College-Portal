import express from 'express';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { authService, AuthRequest } from '../services/authService';
import { logger } from '../utils/logger';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public (but restricted in production)
 */
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  console.log('=== REGISTRATION DEBUG ===');
  console.log('Received body:', JSON.stringify(req.body, null, 2));
  
  const {
    email,
    password,
    role,
    profile,
    studentDetails,
    teacherDetails,
    principalDetails
  } = req.body;

  // Validation
  if (!email?.trim() || !password || !role || !profile) {
    throw new AppError('Email, password, role, and profile are required', 400);
  }

  if (!['student', 'teacher', 'principal'].includes(role)) {
    throw new AppError('Invalid role specified', 400);
  }

  if (!profile.firstName?.trim() || !profile.lastName?.trim()) {
    throw new AppError('First name and last name are required', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters long', 400);
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    throw new AppError('Please provide a valid email address', 400);
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
  if (existingUser) {
    throw new AppError('User already exists with this email', 409);
  }

  // Hash password
  const hashedPassword = await authService.hashPassword(password);

  // Create user data with proper structure matching the schema
  const userData: any = {
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role,
    profile: {
      firstName: profile.firstName?.trim() || '',
      lastName: profile.lastName?.trim() || '',
      phone: profile.phone?.trim() || '',
      address: profile.address?.trim() || '',
      dateOfBirth: profile.dateOfBirth ? new Date(profile.dateOfBirth) : undefined
    },
    preferences: {
      language: 'en',
      notifications: true,
      theme: 'light'
    }
  };

  // Add role-specific details with proper validation
  if (role === 'student' && studentDetails) {
    if (!studentDetails.rollNumber?.trim() || !studentDetails.department?.trim()) {
      throw new AppError('Roll number and department are required for students', 400);
    }
    userData.studentDetails = {
      rollNumber: studentDetails.rollNumber.trim(),
      course: studentDetails.class?.trim() || '',
      semester: Number(studentDetails.semester) || 1,
      batch: studentDetails.section?.trim() || '',
      admissionYear: Number(studentDetails.admissionYear) || new Date().getFullYear(),
      feeStatus: 'pending',
      totalFees: 0,
      paidFees: 0
    };
  } else if (role === 'teacher' && teacherDetails) {
    if (!teacherDetails.employeeId?.trim() || !teacherDetails.department?.trim()) {
      throw new AppError('Employee ID and department are required for teachers', 400);
    }
    userData.teacherDetails = {
      employeeId: teacherDetails.employeeId.trim(),
      department: teacherDetails.department.trim(),
      subjects: Array.isArray(teacherDetails.subjects) ? teacherDetails.subjects : [],
      qualification: teacherDetails.designation?.trim() || '',
      experience: Number(teacherDetails.experience) || 0,
      joiningDate: new Date()
    };
  } else if (role === 'principal' && principalDetails) {
    if (!principalDetails.employeeId?.trim()) {
      throw new AppError('Employee ID is required for principals', 400);
    }
    userData.principalDetails = {
      employeeId: principalDetails.employeeId.trim(),
      joiningDate: new Date(),
      previousExperience: Array.isArray(principalDetails.qualification) 
        ? principalDetails.qualification.join(', ') 
        : ''
    };
  }

  // Create user
  const user = new User(userData);
  await user.save();

  // Generate token
  const token = authService.generateToken({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  logger.info(`New user registered: ${email} with role: ${role}`);

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      preferences: user.preferences,
      studentDetails: user.studentDetails,
      teacherDetails: user.teacherDetails,
      principalDetails: user.principalDetails
    }
  });
}));

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validation
  if (!email?.trim() || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Check if user is active
  if (!user.isActive) {
    throw new AppError('Account is deactivated. Please contact administration.', 403);
  }

  // Verify password
  const isValidPassword = await authService.comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new AppError('Invalid email or password', 401);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate token
  const token = authService.generateToken({
    userId: user._id,
    email: user.email,
    role: user.role
  });

  logger.info(`User logged in: ${email}`);

  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      preferences: user.preferences,
      studentDetails: user.studentDetails,
      teacherDetails: user.teacherDetails,
      principalDetails: user.principalDetails,
      lastLogin: user.lastLogin
    }
  });
}));

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authService.authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!._id).select('-password');
  if (!user) {
    throw new AppError('User not found', 404);
  }
  res.json({ user });
}));

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authService.authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { profile, preferences } = req.body;
  
  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Update profile
  if (profile) {
    user.profile = { ...user.profile, ...profile };
  }

  // Update preferences
  if (preferences) {
    user.preferences = { ...user.preferences, ...preferences };
  }

  await user.save();

  logger.info(`Profile updated for user: ${user.email}`);

  res.json({
    message: 'Profile updated successfully',
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      profile: user.profile,
      preferences: user.preferences
    }
  });
}));

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password', authService.authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Current password and new password are required', 400);
  }

  if (newPassword.length < 6) {
    throw new AppError('New password must be at least 6 characters long', 400);
  }

  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isValidPassword = await authService.comparePassword(currentPassword, user.password);
  if (!isValidPassword) {
    throw new AppError('Current password is incorrect', 400);
  }

  // Hash new password
  const hashedNewPassword = await authService.hashPassword(newPassword);
  user.password = hashedNewPassword;
  await user.save();

  logger.info(`Password changed for user: ${user.email}`);

  res.json({ message: 'Password changed successfully' });
}));

/**
 * @route POST /api/auth/logout
 * @desc Logout user (client-side token removal)
 * @access Private
 */
router.post('/logout', authService.authenticate, asyncHandler(async (req: AuthRequest, res: Response) => {
  // In a stateless JWT setup, logout is handled on the client side
  // You could implement token blacklisting here if needed
  logger.info(`User logged out: ${req.user!.email}`);
  res.json({ message: 'Logout successful' });
}));

export default router;