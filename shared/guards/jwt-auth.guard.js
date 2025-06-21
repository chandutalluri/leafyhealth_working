/**
 * JWT Authentication Guard for All Services
 * Centralized authentication validation
 */

const jwt = require('jsonwebtoken');

class JwtAuthGuard {
  static authenticate(req, res, next) {
    // Skip authentication for health checks and public endpoints
    const publicPaths = ['/health', '/api/docs', '/__introspect', '/swagger'];
    const isPublicPath = publicPaths.some(path => req.path.includes(path));
    
    if (isPublicPath) {
      return next();
    }

    // Extract JWT token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Authentication required',
        timestamp: new Date().toISOString(),
        path: req.path
      });
    }

    const token = authHeader.substring(7);
    
    try {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET not configured');
      }

      const decoded = jwt.verify(token, jwtSecret);
      
      // Attach user information to request
      req.user = {
        id: decoded.userId || decoded.id,
        email: decoded.email,
        role: decoded.role || 'user',
        sessionId: decoded.sessionId
      };

      next();
    } catch (error) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid or expired authentication token',
        timestamp: new Date().toISOString(),
        path: req.path
      });
    }
  }

  static requireRole(roles) {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          statusCode: 401,
          message: 'Authentication required',
          timestamp: new Date().toISOString(),
          path: req.path
        });
      }
      
      if (roles && roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          statusCode: 403,
          message: 'Access denied - insufficient permissions',
          timestamp: new Date().toISOString(),
          path: req.path
        });
      }
      
      next();
    };
  }

  static requireAuth(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Authentication required',
        timestamp: new Date().toISOString(),
        path: req.path
      });
    }
    next();
  }
}

module.exports = { JwtAuthGuard };