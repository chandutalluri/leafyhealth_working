/**
 * Authentication Guard for Production
 * Validates JWT tokens and enforces authentication
 */

const jwt = require('jsonwebtoken');

class AuthGuard {
  static validateJWTConfig() {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required for authentication');
    }
    
    if (jwtSecret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long for security');
    }
    
    if (jwtSecret === 'leafyhealth-jwt-secret-2024' || 
        jwtSecret === 'your_256_bit_cryptographically_secure_random_key_here') {
      throw new Error('JWT_SECRET must be changed from default value for production security');
    }
    
    return jwtSecret;
  }
  
  static createAuthMiddleware() {
    return (req, res, next) => {
      // Skip authentication for health checks and public endpoints
      const publicPaths = ['/health', '/api/docs', '/__introspect'];
      const isPublicPath = publicPaths.some(path => req.path.includes(path));
      
      if (isPublicPath) {
        return next();
      }

      // Extract JWT token
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          statusCode: 401,
          message: 'Authentication token required',
          timestamp: new Date().toISOString()
        });
      }

      const token = authHeader.substring(7);
      
      try {
        const jwtSecret = AuthGuard.validateJWTConfig();
        const decoded = jwt.verify(token, jwtSecret);
        
        // Attach user information to request
        req.user = {
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
          sessionId: decoded.sessionId
        };

        next();
      } catch (error) {
        return res.status(401).json({
          statusCode: 401,
          message: 'Invalid or expired authentication token',
          timestamp: new Date().toISOString()
        });
      }
    };
  }
  
  static requireAuth(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Authentication required',
        timestamp: new Date().toISOString()
      });
    }
    next();
  }
  
  static requireRole(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          statusCode: 401,
          message: 'Authentication required',
          timestamp: new Date().toISOString()
        });
      }
      
      if (roles && roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          statusCode: 403,
          message: 'Access denied',
          timestamp: new Date().toISOString()
        });
      }
      
      next();
    };
  }
}

module.exports = { AuthGuard };