import { AuthService } from '../services/authService';

const authService = new AuthService();

// Export the authenticate middleware as authenticateToken for backward compatibility
export const authenticateToken = authService.authenticate;

// Export the authorize middleware
export const authorize = authService.authorize;

// Export the AuthRequest type
export { AuthRequest } from '../services/authService';