/**
 * Auth Service for API Gateway
 * Handles JWT validation and user authentication
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
  constructor(pool) {
    this.pool = pool;
    this.jwtSecret = process.env.JWT_SECRET;
    if (!this.jwtSecret) {
      throw new Error('JWT_SECRET environment variable is required for production security');
    }
  }

  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      
      // Check if user session is still valid
      const query = `
        SELECT 
          us.id as session_id,
          us.user_id,
          us.is_active,
          us.expires_at,
          u.email,
          u.username,
          u.role,
          u.is_active as user_active
        FROM user_sessions us
        JOIN users u ON us.user_id = u.id
        WHERE us.session_token = $1 AND us.is_active = true
      `;
      
      const result = await this.pool.query(query, [token]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const session = result.rows[0];
      
      // Check if session has expired
      if (new Date() > new Date(session.expires_at)) {
        await this.deactivateSession(session.session_id);
        return null;
      }
      
      return {
        userId: session.user_id,
        email: session.email,
        username: session.username,
        role: session.role,
        sessionId: session.session_id
      };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  async authenticateUser(email, password) {
    try {
      const query = `
        SELECT id, email, username, password_hash, role, is_active
        FROM users 
        WHERE email = $1 AND is_active = true
      `;
      
      const result = await this.pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return null;
      }
      
      // Create new session
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      const sessionQuery = `
        INSERT INTO user_sessions (user_id, session_token, expires_at, is_active, created_at)
        VALUES ($1, $2, $3, true, NOW())
        RETURNING id
      `;
      
      await this.pool.query(sessionQuery, [user.id, sessionToken, expiresAt]);
      
      return {
        token: sessionToken,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role
        },
        expiresAt
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  generateSessionToken() {
    const payload = {
      timestamp: Date.now(),
      random: Math.random().toString(36)
    };
    
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });
  }

  async deactivateSession(sessionId) {
    try {
      const query = `
        UPDATE user_sessions 
        SET is_active = false, updated_at = NOW()
        WHERE id = $1
      `;
      
      await this.pool.query(query, [sessionId]);
    } catch (error) {
      console.error('Session deactivation error:', error);
    }
  }

  async getUserPermissions(userId) {
    try {
      const query = `
        SELECT DISTINCT r.permissions
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = $1 AND ur.is_active = true
      `;
      
      const result = await this.pool.query(query, [userId]);
      
      const permissions = new Set();
      result.rows.forEach(row => {
        if (row.permissions) {
          Object.keys(row.permissions).forEach(permission => {
            if (row.permissions[permission]) {
              permissions.add(permission);
            }
          });
        }
      });
      
      return Array.from(permissions);
    } catch (error) {
      console.error('Get permissions error:', error);
      return [];
    }
  }

  async checkPermission(userId, requiredPermission) {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(requiredPermission) || permissions.includes('admin');
  }

  async logAuthEvent(userId, event, details = {}) {
    try {
      const query = `
        INSERT INTO audit_logs (user_id, action, details, created_at)
        VALUES ($1, $2, $3, NOW())
      `;
      
      await this.pool.query(query, [userId, event, JSON.stringify(details)]);
    } catch (error) {
      console.error('Auth event logging error:', error);
    }
  }
}

module.exports = AuthService;