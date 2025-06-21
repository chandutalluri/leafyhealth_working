/**
 * Central Authentication Gateway
 * Handles login and intelligent app redirection based on user roles
 */

const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const { Pool } = require('pg')

const app = express()
const PORT = 8084

// Middleware
app.use(cors())
app.use(express.json())

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'leafyhealth-super-secret-key-2025'
const JWT_EXPIRES_IN = '24h'

// App assignment mapping
const APP_ROUTING = {
  'super-admin': {
    port: 3003,
    url: 'http://localhost:3003',
    name: 'Super Admin Portal'
  },
  'admin': {
    port: 3002, 
    url: 'http://localhost:3002',
    name: 'Admin Portal'
  },
  'manager': {
    port: 3002,
    url: 'http://localhost:3002', 
    name: 'Admin Portal'
  },
  'customer': {
    port: 3000,
    url: 'http://localhost:3000',
    name: 'Customer Portal'
  },
  'staff': {
    port: 3000,
    url: 'http://localhost:3000',
    name: 'Staff Portal'
  },
  'delivery': {
    port: 3001,
    url: 'http://localhost:3001',
    name: 'Mobile Delivery App'
  },
  'cashier': {
    port: 3000,
    url: 'http://localhost:3000',
    name: 'POS System'
  },
  'analyst': {
    port: 3002,
    url: 'http://localhost:3002',
    name: 'Analytics Portal'
  }
}

// PostgreSQL Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

// Generate JWT token
function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    assignedApp: user.assignedApp,
    permissions: user.permissions,
    appUrl: APP_ROUTING[user.assignedApp]?.url,
    appName: APP_ROUTING[user.assignedApp]?.name
  }
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

// Verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Find user by credentials from PostgreSQL database
async function findUser(identifier, password) {
  try {
    // Query users from database with role information
    const query = `
      SELECT 
        u.id, u.username, u.email, u.password, u.status, u.last_login,
        r.name as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.is_active = true
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE (u.username = $1 OR u.email = $1) AND u.status = 'active'
    `
    
    const result = await pool.query(query, [identifier])
    
    if (result.rows.length === 0) {
      return null
    }
    
    const user = result.rows[0]
    
    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return null
    }
    
    // Map database role to app assignment
    const roleMapping = {
      'super_admin': 'super-admin',
      'admin': 'admin',
      'manager': 'admin',
      'employee': 'admin',
      'customer': 'customer'
    }
    
    const assignedApp = roleMapping[user.role_name] || 'customer'
    
    // Get permissions based on role
    const permissions = user.role_name === 'super_admin' 
      ? ['all'] 
      : user.role_name === 'admin' || user.role_name === 'manager'
      ? ['read', 'create', 'update', 'delete']
      : user.role_name === 'employee'
      ? ['read', 'create', 'update']
      : ['read']
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role_name,
      assignedApp: assignedApp,
      status: user.status,
      lastLogin: user.last_login,
      permissions: permissions
    }
  } catch (error) {
    console.error('Database error in findUser:', error)
    return null
  }
}

// Central Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body
    
    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username/email and password required'
      })
    }
    
    const user = await findUser(identifier, password)
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      })
    }
    
    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Account is disabled'
      })
    }
    
    // Update last login in database
    await pool.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    )
    
    // Generate JWT token
    const token = generateToken(user)
    const appInfo = APP_ROUTING[user.assignedApp]
    
    if (!appInfo) {
      return res.status(500).json({
        success: false,
        error: 'No app assigned to user role'
      })
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          assignedApp: user.assignedApp,
          permissions: user.permissions
        },
        redirectTo: {
          url: appInfo.url,
          name: appInfo.name,
          port: appInfo.port
        }
      }
    })
    
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
})

// Token Verification Endpoint
app.post('/api/auth/verify', (req, res) => {
  try {
    const { token } = req.body
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token required'
      })
    }
    
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      })
    }
    
    res.json({
      success: true,
      data: decoded
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Token verification failed'
    })
  }
})

// Get App Assignment for User
app.get('/api/auth/app-assignment/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    
    const query = `
      SELECT 
        u.id, u.username, u.email, u.status,
        r.name as role_name
      FROM users u
      LEFT JOIN user_roles ur ON u.id = ur.user_id AND ur.is_active = true
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE u.id = $1 AND u.status = 'active'
    `
    
    const result = await pool.query(query, [parseInt(userId)])
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    
    const user = result.rows[0]
    
    const roleMapping = {
      'super_admin': 'super-admin',
      'admin': 'admin',
      'manager': 'admin',
      'employee': 'admin',
      'customer': 'customer'
    }
    
    const assignedApp = roleMapping[user.role_name] || 'customer'
    const appInfo = APP_ROUTING[assignedApp]
    
    res.json({
      success: true,
      data: {
        userId: user.id,
        role: user.role_name,
        assignedApp: assignedApp,
        appInfo: appInfo
      }
    })
    
  } catch (error) {
    console.error('Database error in app-assignment:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get app assignment'
    })
  }
})

// Create New User (Super Admin only)
app.post('/api/auth/create-user', (req, res) => {
  try {
    const { username, email, password, role, assignedApp, status, token } = req.body
    
    // Verify super admin token
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        error: 'Super admin access required'
      })
    }
    
    // Check if user already exists
    const existingUser = users.find(u => u.username === username || u.email === email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this username or email already exists'
      })
    }
    
    // Generate new user ID
    const newUserId = Math.max(...users.map(u => u.id)) + 1
    
    // Create new user
    const newUser = {
      id: newUserId,
      username,
      email,
      password: '$2a$10$hash', // In production, hash the password with bcrypt
      role,
      assignedApp,
      status: status || 'active',
      lastLogin: null,
      permissions: role === 'super-admin' ? ['all'] : ['read']
    }
    
    users.push(newUser)
    
    res.json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        assignedApp: newUser.assignedApp,
        status: newUser.status
      }
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    })
  }
})

// Update User App Assignment (Super Admin only)
app.post('/api/auth/assign-app', (req, res) => {
  try {
    const { userId, assignedApp, token } = req.body
    
    // Verify super admin token
    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        error: 'Super admin access required'
      })
    }
    
    const user = users.find(u => u.id === parseInt(userId))
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }
    
    if (!APP_ROUTING[assignedApp]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid app assignment'
      })
    }
    
    user.assignedApp = assignedApp
    
    res.json({
      success: true,
      message: 'App assignment updated successfully',
      data: {
        userId: user.id,
        newAssignment: assignedApp,
        appInfo: APP_ROUTING[assignedApp]
      }
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update app assignment'
    })
  }
})

// Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, and password are required'
      })
    }
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    )
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User with this username or email already exists'
      })
    }
    
    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    
    // Insert new user
    const insertUserQuery = `
      INSERT INTO users (username, email, password, name, status, is_active, email_verified, created_at, updated_at)
      VALUES ($1, $2, $3, $1, 'active', true, false, NOW(), NOW())
      RETURNING id, username, email, status
    `
    
    const newUserResult = await pool.query(insertUserQuery, [username, email, hashedPassword])
    const newUser = newUserResult.rows[0]
    
    // Assign customer role by default
    const customerRoleQuery = 'SELECT id FROM roles WHERE name = $1'
    const roleResult = await pool.query(customerRoleQuery, ['customer'])
    
    if (roleResult.rows.length > 0) {
      await pool.query(
        'INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at, is_active) VALUES ($1, $2, $1, NOW(), true)',
        [newUser.id, roleResult.rows[0].id]
      )
    }
    
    // Generate token for immediate login
    const userForToken = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: 'customer',
      assignedApp: 'customer',
      status: newUser.status,
      permissions: ['read']
    }
    
    const token = generateToken(userForToken)
    const appInfo = APP_ROUTING['customer']
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: userForToken,
        redirectTo: appInfo
      }
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    })
  }
})

// Logout Endpoint
app.post('/api/auth/logout', (req, res) => {
  // Since JWT is stateless, logout is handled client-side by removing token
  res.json({
    success: true,
    message: 'Logout successful'
  })
})

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'central-auth-gateway',
    timestamp: new Date().toISOString(),
    activeUsers: users.filter(u => u.status === 'active').length
  })
})

// Get All App Routes (for debugging)
app.get('/api/auth/app-routes', (req, res) => {
  res.json({
    success: true,
    data: APP_ROUTING
  })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Central Auth Error:', error)
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🔐 Central Authentication Gateway running on port ${PORT}`)
  console.log(`🌐 Login endpoint: http://localhost:${PORT}/api/auth/login`)
  console.log(`🔍 Token verify: http://localhost:${PORT}/api/auth/verify`)
  console.log(`📱 App routing: ${Object.keys(APP_ROUTING).length} apps configured`)
  console.log(`❤️  Health check: http://localhost:${PORT}/health`)
})