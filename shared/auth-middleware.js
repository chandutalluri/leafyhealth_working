/**
 * Shared Authentication Middleware
 * Used across all three apps for JWT token verification and role checking
 */

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'leafyhealth-super-secret-key-2025'

// App-specific allowed roles
const APP_PERMISSIONS = {
  'super-admin': ['super-admin'], // Only super admin
  'admin': ['super-admin', 'admin', 'manager', 'analyst'], // Admin-level roles
  'user': ['super-admin', 'admin', 'manager', 'customer', 'staff', 'delivery', 'cashier'] // All roles
}

/**
 * Verify JWT Token
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

/**
 * Authentication Middleware
 * Checks if user has valid JWT token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    })
  }

  const user = verifyToken(token)
  if (!user) {
    return res.status(403).json({
      success: false,
      error: 'Invalid or expired token'
    })
  }

  req.user = user
  next()
}

/**
 * App Access Authorization
 * Checks if user is authorized to access specific app
 */
function authorizeApp(appType) {
  return (req, res, next) => {
    const user = req.user
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }

    const allowedRoles = APP_PERMISSIONS[appType]
    if (!allowedRoles || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. This app is restricted to: ${allowedRoles.join(', ')}`
      })
    }

    // Check if user's assigned app matches current app
    const userAssignedApp = user.assignedApp
    const currentAppMatches = (
      (appType === 'super-admin' && userAssignedApp === 'super-admin') ||
      (appType === 'admin' && ['admin', 'manager', 'analyst'].includes(userAssignedApp)) ||
      (appType === 'user' && ['customer', 'staff', 'delivery', 'cashier'].includes(userAssignedApp))
    )

    if (!currentAppMatches && user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        error: 'You are not assigned to this app',
        redirectTo: getAppUrl(userAssignedApp)
      })
    }

    next()
  }
}

/**
 * Permission-based Authorization
 * Checks if user has specific CRUD permissions
 */
function authorizePermission(requiredPermission) {
  return (req, res, next) => {
    const user = req.user
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }

    // Super admin has all permissions
    if (user.role === 'super-admin' || user.permissions.includes('all')) {
      return next()
    }

    if (!user.permissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        error: `Permission denied. Required: ${requiredPermission}`
      })
    }

    next()
  }
}

/**
 * Get App URL based on assignment
 */
function getAppUrl(assignedApp) {
  const APP_URLS = {
    'super-admin': 'http://localhost:3003',
    'admin': 'http://localhost:3002',
    'manager': 'http://localhost:3002',
    'analyst': 'http://localhost:3002',
    'customer': 'http://localhost:3000',
    'staff': 'http://localhost:3000',
    'cashier': 'http://localhost:3000',
    'delivery': 'http://localhost:3001'
  }
  
  return APP_URLS[assignedApp] || 'http://localhost:3000'
}

/**
 * Client-side Authentication Check
 * For use in Next.js pages
 */
function createAuthChecker(appType) {
  return function checkAuth() {
    if (typeof window === 'undefined') return null // Server-side
    
    const token = localStorage.getItem('leafyhealth_token')
    const userStr = localStorage.getItem('leafyhealth_user')
    
    if (!token || !userStr) {
      // Redirect to central login
      window.location.href = 'http://localhost:8084'
      return null
    }

    try {
      const user = JSON.parse(userStr)
      const allowedRoles = APP_PERMISSIONS[appType]
      
      if (!allowedRoles.includes(user.role)) {
        // User not authorized for this app
        localStorage.removeItem('leafyhealth_token')
        localStorage.removeItem('leafyhealth_user')
        window.location.href = 'http://localhost:8084'
        return null
      }

      // Check app assignment
      const userAssignedApp = user.assignedApp
      const currentAppMatches = (
        (appType === 'super-admin' && userAssignedApp === 'super-admin') ||
        (appType === 'admin' && ['admin', 'manager', 'analyst'].includes(userAssignedApp)) ||
        (appType === 'user' && ['customer', 'staff', 'delivery', 'cashier'].includes(userAssignedApp))
      )

      if (!currentAppMatches && user.role !== 'super-admin') {
        // Redirect to correct app
        window.location.href = getAppUrl(userAssignedApp)
        return null
      }

      return { token, user }
    } catch (error) {
      // Corrupted data
      localStorage.removeItem('leafyhealth_token')
      localStorage.removeItem('leafyhealth_user')
      window.location.href = 'http://localhost:8084'
      return null
    }
  }
}

/**
 * Logout Function
 */
function logout() {
  localStorage.removeItem('leafyhealth_token')
  localStorage.removeItem('leafyhealth_user')
  window.location.href = 'http://localhost:8084'
}

module.exports = {
  verifyToken,
  authenticateToken,
  authorizeApp,
  authorizePermission,
  getAppUrl,
  createAuthChecker,
  logout,
  APP_PERMISSIONS
}