/**
 * Comprehensive Authentication Service for Multi-Branch ERP
 * Handles both customer and internal user authentication
 */

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const compression = require('compression');
const { Pool } = require('pg');

const app = express();
const PORT = 8085;

// Trust proxy for proper rate limiting
app.set('trust proxy', 1);

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

app.use(compression());

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// General rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5000',  // Customer Ecommerce Web
    'http://localhost:3002',  // Admin Portal
    'http://localhost:3003',  // Super Admin Dashboard
    'http://localhost:3001',  // Ops Delivery
    'https://61915ea0-a177-4649-b04c-5bf5513c2ae7-00-25z6jk7p0vm4h.riker.replit.dev',
    'https://596134ae-2368-4b16-bd88-c5ed3a677441-00-sup9fyy6rfx0.pike.replit.dev'
  ],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

const JWT_SECRET = process.env.JWT_SECRET || 'leafyhealth-multi-branch-secret';

// User types
const USER_TYPES = {
  CUSTOMER: 'customer',
  INTERNAL: 'internal'
};

// Internal user roles with dual Super Admin system
const INTERNAL_ROLES = {
  GLOBAL_SUPER_ADMIN: 'global_super_admin',    // Full system control
  OPERATIONAL_SUPER_ADMIN: 'operational_super_admin', // Operational oversight
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff'
};

/**
 * Generate JWT Token with branch context
 */
function generateToken(user, userType) {
  const payload = {
    id: user.id,
    email: user.email,
    type: userType,
    role: user.role || 'customer',
    branchId: user.branch_id || null,
    isActive: user.is_active
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify JWT Token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Customer Registration
 */
app.post('/api/auth/customer/register', 
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
    body('firstName').trim().isLength({ min: 1, max: 50 }),
    body('lastName').trim().isLength({ min: 1, max: 50 }),
    body('phone').isMobilePhone()
  ],
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  try {
    const { email, password, firstName, lastName, phone, branchId } = req.body;

    // Check if customer exists
    const existingCustomer = await pool.query(
      'SELECT id FROM customers WHERE email = $1 OR phone = $2',
      [email, phone]
    );

    if (existingCustomer.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer already exists with this email or phone'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create customer account
    const result = await pool.query(`
      INSERT INTO customers (
        email, password_hash, first_name, last_name, phone, 
        branch_id, customer_since, is_active, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), true, NOW())
      RETURNING id, email, first_name, last_name, phone, branch_id, is_active
    `, [email, passwordHash, firstName, lastName, phone, branchId]);

    const customer = result.rows[0];
    const token = generateToken(customer, USER_TYPES.CUSTOMER);

    res.json({
      success: true,
      message: 'Customer registered successfully',
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        type: USER_TYPES.CUSTOMER,
        branchId: customer.branch_id
      },
      token: token
    });

  } catch (error) {
    console.error('Customer registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
});

/**
 * Customer Login
 */
app.post('/api/auth/customer/login', 
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 })
  ],
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  try {
    const { email, password } = req.body;

    // Find customer
    const result = await pool.query(`
      SELECT id, email, password_hash, first_name, last_name, phone, 
             branch_id, is_active, last_login_at
      FROM customers 
      WHERE email = $1 AND is_active = true
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const customer = result.rows[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, customer.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await pool.query(
      'UPDATE customers SET last_login_at = NOW() WHERE id = $1',
      [customer.id]
    );

    const token = generateToken(customer, USER_TYPES.CUSTOMER);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        type: USER_TYPES.CUSTOMER,
        branchId: customer.branch_id
      },
      token: token
    });

  } catch (error) {
    console.error('Customer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

/**
 * Internal User Login
 */
app.post('/api/auth/internal/login', 
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 1 })
  ],
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  try {
    console.log('INTERNAL LOGIN REQUEST BODY:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers['content-type']);
    const { email, password } = req.body;
    console.log('Extracted email:', email, 'password length:', password ? password.length : 'undefined');

    // Find internal user
    const result = await pool.query(`
      SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, u.role,
             u.is_active, u.last_login_at, u.branch_id
      FROM internal_users u
      WHERE u.email = $1 AND u.is_active = true AND u.role IN ('super_admin', 'admin', 'manager', 'staff')
    `, [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or account disabled'
      });
    }

    const user = result.rows[0];

    // Verify password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await pool.query(
      'UPDATE internal_users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      branch_id: user.branch_id,
      is_active: user.is_active
    }, USER_TYPES.INTERNAL);

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        type: USER_TYPES.INTERNAL,
        branchId: user.branch_id,
        branchName: user.branch_name
      },
      token: token
    });

  } catch (error) {
    console.error('Internal login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
});

/**
 * Create Internal User (Admin/Super Admin only)
 */
app.post('/api/auth/internal/create-user', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, branchId } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization required'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.type !== USER_TYPES.INTERNAL) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authorization'
      });
    }

    // Check if user has permission to create users
    if (!['super_admin', 'admin'].includes(decoded.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create internal user
    const result = await pool.query(`
      INSERT INTO users (
        email, password, first_name, last_name, role, 
        is_active, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())
      RETURNING id, email, first_name, last_name, role, is_active
    `, [email, password, firstName, lastName, role]);

    const newUser = result.rows[0];

    // Assign to branch if specified
    if (branchId) {
      await pool.query(`
        INSERT INTO user_branch_assignments (
          user_id, branch_id, role, is_primary, assigned_by, assigned_at, is_active
        ) VALUES ($1, $2, $3, true, $4, NOW(), true)
      `, [newUser.id, branchId, role, decoded.id]);
    }

    res.json({
      success: true,
      message: 'Internal user created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
        type: USER_TYPES.INTERNAL,
        branchId: branchId
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

/**
 * Verify Token Endpoint
 */
app.post('/api/auth/verify', (req, res) => {
  try {
    const { token } = req.body;
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    res.json({
      success: true,
      user: decoded
    });

  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token verification failed'
    });
  }
});

/**
 * Get Current User Profile
 */
app.get('/api/auth/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization required'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    let userProfile;
    if (decoded.type === USER_TYPES.CUSTOMER) {
      const result = await pool.query(`
        SELECT id, email, first_name, last_name, phone, branch_id,
               customer_since, total_orders, total_spent
        FROM customers WHERE id = $1
      `, [decoded.id]);
      userProfile = result.rows[0];
    } else {
      const result = await pool.query(`
        SELECT u.id, u.email, u.first_name, u.last_name, u.role,
               uba.branch_id, b.name as branch_name
        FROM users u
        LEFT JOIN user_branch_assignments uba ON u.id = uba.user_id
        LEFT JOIN branches b ON uba.branch_id = b.id
        WHERE u.id = $1
      `, [decoded.id]);
      userProfile = result.rows[0];
    }

    res.json({
      success: true,
      user: {
        ...userProfile,
        type: decoded.type
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
});

/**
 * Super Admin Password Reset for Internal Users
 */
app.post('/api/auth/admin/reset-password', async (req, res) => {
  try {
    const { targetUserId, newPassword, adminToken } = req.body;

    // Verify admin token
    const decoded = verifyToken(adminToken);
    if (!decoded || decoded.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Super admin access required'
      });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password for customer
    if (req.body.userType === 'customer') {
      const result = await pool.query(
        'UPDATE customers SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING email, first_name, last_name',
        [passwordHash, targetUserId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found'
        });
      }

      // Log the password reset action
      await pool.query(
        'INSERT INTO audit_logs (user_id, user_role, action, ip_address, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [decoded.id, decoded.role, `Password reset for customer ${targetUserId}`, req.ip]
      );

      res.json({
        success: true,
        message: 'Customer password reset successfully',
        user: result.rows[0]
      });
    } else {
      // Update password for internal user
      const result = await pool.query(
        'UPDATE internal_users SET password_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING email, first_name, last_name, role',
        [passwordHash, targetUserId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Internal user not found'
        });
      }

      // Log the password reset action
      await pool.query(
        'INSERT INTO audit_logs (user_id, user_role, action, ip_address, created_at) VALUES ($1, $2, $3, $4, NOW())',
        [decoded.id, decoded.role, `Password reset for internal user ${targetUserId}`, req.ip]
      );

      res.json({
        success: true,
        message: 'Internal user password reset successfully',
        user: result.rows[0]
      });
    }

  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Password reset failed'
    });
  }
});

/**
 * Super Admin Create Internal User
 */
app.post('/api/auth/admin/create-user', async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, branchId, adminToken } = req.body;

    // Verify admin token
    const decoded = verifyToken(adminToken);
    if (!decoded || decoded.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Super admin access required'
      });
    }

    // Validate role
    if (!Object.values(INTERNAL_ROLES).includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM internal_users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create internal user
    const result = await pool.query(
      'INSERT INTO internal_users (email, password_hash, first_name, last_name, role, branch_id, is_active) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING id, email, first_name, last_name, role, branch_id',
      [email, passwordHash, firstName, lastName, role, branchId]
    );

    // Log the user creation action
    await pool.query(
      'INSERT INTO audit_logs (user_id, user_role, action, ip_address, created_at) VALUES ($1, $2, $3, $4, NOW())',
      [decoded.id, decoded.role, `Created internal user ${result.rows[0].id} with role ${role}`, req.ip]
    );

    res.json({
      success: true,
      message: 'Internal user created successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('User creation error:', error);
    res.status(500).json({
      success: false,
      message: 'User creation failed'
    });
  }
});

/**
 * Super Admin List All Users
 */
app.get('/api/auth/admin/users', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization required'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);

    if (!decoded || decoded.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Super admin access required'
      });
    }

    // Get all internal users
    const internalUsers = await pool.query(`
      SELECT iu.id, iu.email, iu.first_name, iu.last_name, iu.role, 
             iu.branch_id, b.name as branch_name, iu.is_active, iu.last_login_at, iu.created_at
      FROM internal_users iu
      LEFT JOIN branches b ON iu.branch_id = b.id
      ORDER BY iu.created_at DESC
    `);

    // Get all customers
    const customers = await pool.query(`
      SELECT c.id, c.email, c.first_name, c.last_name, 'customer' as role,
             c.branch_id, b.name as branch_name, c.is_active, c.last_login_at, c.created_at
      FROM customers c
      LEFT JOIN branches b ON c.branch_id = b.id
      ORDER BY c.created_at DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      data: {
        internalUsers: internalUsers.rows,
        customers: customers.rows,
        totalInternal: internalUsers.rows.length,
        totalCustomers: customers.rows.length
      }
    });

  } catch (error) {
    console.error('User list error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

/**
 * Logout (Token invalidation would require a blacklist in production)
 */
app.post('/api/auth/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Authentication Service',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔐 Authentication Service running on port ${PORT}`);
  console.log('👥 Customer & Internal User Authentication');
  console.log('🏢 Multi-Branch Access Control');
  console.log('🔒 JWT Token-Based Security');
  console.log('❤️  Health check: http://localhost:' + PORT + '/health');
});