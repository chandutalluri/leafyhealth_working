/**
 * Role-Based Access Control Middleware for Multi-Branch ERP
 * Provides comprehensive permission checking and branch isolation
 */

const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const JWT_SECRET = process.env.JWT_SECRET || 'leafyhealth-multi-branch-secret';

/**
 * Verify JWT token and extract user information
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Check if user has specific permission
 */
async function hasPermission(userPayload, requiredPermission, resourceId = null) {
  try {
    // Super admin has all permissions
    if (userPayload.role === 'super_admin') {
      return true;
    }

    // Check if user has the required permission
    const permissionQuery = `
      SELECT rp.*, p.name, p.resource, p.action, rp.branch_specific
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role = $1 AND p.name = $2
    `;
    
    const result = await pool.query(permissionQuery, [userPayload.role, requiredPermission]);
    
    if (result.rows.length === 0) {
      return false;
    }

    const permission = result.rows[0];
    
    // If permission is branch-specific and user is not super admin
    if (permission.branch_specific && userPayload.role !== 'super_admin') {
      // User must have a branch assigned
      if (!userPayload.branchId) {
        return false;
      }
      
      // If checking access to specific resource, ensure it belongs to user's branch
      if (resourceId) {
        return await checkBranchAccess(userPayload.branchId, permission.resource, resourceId);
      }
    }

    return true;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}

/**
 * Check if resource belongs to user's branch
 */
async function checkBranchAccess(userBranchId, resourceType, resourceId) {
  try {
    const branchCheckQueries = {
      'products': 'SELECT 1 FROM products WHERE id = $1 AND branch_id = $2',
      'orders': 'SELECT 1 FROM orders WHERE id = $1 AND branch_id = $2',
      'customers': 'SELECT 1 FROM customers WHERE id = $1 AND branch_id = $2',
      'inventory': 'SELECT 1 FROM inventory WHERE id = $1 AND branch_id = $2',
      'employees': 'SELECT 1 FROM employees WHERE id = $1 AND branch_id = $2'
    };

    const query = branchCheckQueries[resourceType];
    if (!query) {
      return true; // If no specific check needed, allow access
    }

    const result = await pool.query(query, [resourceId, userBranchId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Branch access check error:', error);
    return false;
  }
}

/**
 * Main RBAC middleware factory
 */
function rbacMiddleware(requiredPermission, options = {}) {
  return async (req, res, next) => {
    try {
      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Authentication token required'
        });
      }

      const token = authHeader.replace('Bearer ', '');
      const userPayload = verifyToken(token);

      if (!userPayload) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }

      // Check if user is active
      if (!userPayload.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // Extract resource ID from request if specified
      const resourceId = options.resourceIdParam ? req.params[options.resourceIdParam] : null;

      // Check permission
      const hasRequiredPermission = await hasPermission(userPayload, requiredPermission, resourceId);
      
      if (!hasRequiredPermission) {
        return res.status(403).json({
          success: false,
          message: 'Insufficient permissions for this action'
        });
      }

      // Add user info to request for use in controllers
      req.user = userPayload;
      req.userBranchId = userPayload.branchId;
      req.userRole = userPayload.role;

      next();
    } catch (error) {
      console.error('RBAC middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
}

/**
 * Branch filtering middleware for queries
 */
function branchFilterMiddleware() {
  return (req, res, next) => {
    // Add branch filtering to query for non-super-admin users
    if (req.userRole !== 'super_admin' && req.userBranchId) {
      req.branchFilter = req.userBranchId;
    }
    next();
  };
}

/**
 * Rate limiting middleware for authentication endpoints
 */
const loginAttempts = new Map();

function rateLimitMiddleware(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
  return (req, res, next) => {
    const identifier = req.ip + ':' + (req.body.email || '');
    const now = Date.now();
    
    if (!loginAttempts.has(identifier)) {
      loginAttempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const attempts = loginAttempts.get(identifier);
    
    if (now > attempts.resetTime) {
      loginAttempts.set(identifier, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (attempts.count >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many login attempts. Please try again later.'
      });
    }

    attempts.count++;
    next();
  };
}

/**
 * Audit logging middleware
 */
function auditLogMiddleware() {
  return async (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log the action after response is sent
      setImmediate(() => {
        logUserAction(req, res.statusCode, data);
      });
      
      return originalSend.call(this, data);
    };
    
    next();
  };
}

async function logUserAction(req, statusCode, responseData) {
  try {
    if (req.user && statusCode < 400) {
      const logEntry = {
        user_id: req.user.id,
        user_role: req.user.role,
        branch_id: req.user.branchId,
        action: `${req.method} ${req.path}`,
        ip_address: req.ip,
        user_agent: req.get('User-Agent'),
        timestamp: new Date(),
        status_code: statusCode
      };

      // Store in database or logging service
      await pool.query(
        'INSERT INTO audit_logs (user_id, user_role, branch_id, action, ip_address, user_agent, status_code, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [logEntry.user_id, logEntry.user_role, logEntry.branch_id, logEntry.action, logEntry.ip_address, logEntry.user_agent, logEntry.status_code, logEntry.timestamp]
      );
    }
  } catch (error) {
    console.error('Audit logging error:', error);
  }
}

module.exports = {
  rbacMiddleware,
  branchFilterMiddleware,
  rateLimitMiddleware,
  auditLogMiddleware,
  hasPermission,
  verifyToken
};