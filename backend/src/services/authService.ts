import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: 'student' | 'teacher' | 'principal';
}

export class AuthService {
  private jwtSecret: string;
  private jwtExpiry: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-fallback-secret-key-for-development-only';
    this.jwtExpiry = process.env.JWT_EXPIRY || '7d';
    
    if (!process.env.JWT_SECRET) {
      console.warn('Warning: JWT_SECRET not set, using fallback secret');
    }
  }

  /**
   * Hash password
   */
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compare password
   */
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Generate JWT token
   */
  generateToken(payload: JWTPayload): string {
    // Use explicit typing to avoid JWT library type conflicts
    return (jwt.sign as any)(
      payload,
      this.jwtSecret,
      { expiresIn: this.jwtExpiry }
    );
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): JWTPayload {
    return (jwt.verify as any)(token, this.jwtSecret) as JWTPayload;
  }

  /**
   * Authentication middleware
   */
  authenticate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        res.status(401).json({ error: 'Access denied. No token provided.' });
        return;
      }

      const decoded = this.verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        res.status(401).json({ error: 'Invalid token or inactive user.' });
        return;
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token.' });
    }
  };

  /**
   * Role-based authorization middleware
   */
  authorize = (roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required.' });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        return;
      }

      next();
    };
  };

  /**
   * Generate secure password
   */
  generateSecurePassword(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  }
}

export const authService = new AuthService();