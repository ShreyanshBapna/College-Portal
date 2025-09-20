import express from 'express';
import { Request, Response } from 'express';
import { User } from '../models/User';
import { authService, AuthRequest } from '../services/authService';
import { logger } from '../utils/logger';

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public (but restricted in production)
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await authService.hashPassword(password);

    // Create user data
    const userData: any = {
      email,
      password: hashedPassword,
      role,
      profile,
      preferences: {
        language: 'en',
        notifications: true,
        theme: 'light'
      }
    };

    // Add role-specific details
    if (role === 'student' && studentDetails) {
      userData.studentDetails = studentDetails;
    } else if (role === 'teacher' && teacherDetails) {
      userData.teacherDetails = teacherDetails;
    } else if (role === 'principal' && principalDetails) {
      userData.principalDetails = principalDetails;
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
        preferences: user.preferences
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ error: 'Account is deactivated. Please contact administration.' });
    }

    // Verify password
    const isValidPassword = await authService.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' });
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

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authService.authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select('-password');
    res.json({ user });
  } catch (error) {
    logger.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
});

/**
 * @route PUT /api/auth/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/profile', authService.authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { profile, preferences } = req.body;
    
    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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

  } catch (error) {
    logger.error('Profile update error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

/**
 * @route POST /api/auth/change-password
 * @desc Change user password
 * @access Private
 */
router.post('/change-password', authService.authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await authService.comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedNewPassword = await authService.hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();

    logger.info(`Password changed for user: ${user.email}`);

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    logger.error('Password change error:', error);
    res.status(500).json({ error: 'Error changing password' });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user (client-side token removal)
 * @access Private
 */
router.post('/logout', authService.authenticate, async (req: AuthRequest, res: Response) => {
  // In a stateless JWT setup, logout is handled on the client side
  // You could implement token blacklisting here if needed
  logger.info(`User logged out: ${req.user!.email}`);
  res.json({ message: 'Logout successful' });
});

export default router;