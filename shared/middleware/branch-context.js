/**
 * Branch Context Middleware
 * Ensures all API requests include proper branch context for data isolation
 */

const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/**
 * Extract branch context from user session and request
 */
async function extractBranchContext(req, res, next) {
  try {
    let branchId = null;
    let userRole = null;
    let userId = null;

    // Extract from JWT token if available
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'leafyhealth-secret');
        userId = decoded.id;
        userRole = decoded.role;
        branchId = decoded.branchId;
      } catch (jwtError) {
        console.log('JWT decode failed, continuing with branch extraction from params');
      }
    }

    // Parse URL to extract query parameters
    const url = require('url');
    const parsedUrl = url.parse(req.url, true);
    const paramBranchId = parsedUrl.query.branchId;
    if (paramBranchId && paramBranchId !== 'null') {
      branchId = paramBranchId;
    }

    // For super admin, allow access to all branches
    if (userRole === 'super_admin') {
      req.branchContext = {
        branchId: branchId,
        userId: userId,
        role: userRole,
        hasFullAccess: true,
        allowedBranches: 'all'
      };
    } else if (userId) {
      // Get user's allowed branches from database
      const userBranches = await pool.query(`
        SELECT uba.branch_id, uba.role, b.name as branch_name
        FROM user_branch_assignments uba
        JOIN branches b ON uba.branch_id = b.id
        WHERE uba.user_id = $1 AND uba.is_active = true
      `, [userId]);

      const allowedBranches = userBranches.rows.map(row => row.branch_id);
      
      // If user has branch assignments, validate access
      if (allowedBranches.length > 0) {
        if (branchId && !allowedBranches.includes(branchId)) {
          return res.status(403).json({
            error: 'Access denied to this branch',
            message: 'User not authorized for the requested branch'
          });
        }
      }

      req.branchContext = {
        branchId: branchId || allowedBranches[0],
        userId: userId,
        role: userRole,
        hasFullAccess: false,
        allowedBranches: allowedBranches
      };
    } else {
      // No user context, set default branch for public access
      const defaultBranch = await pool.query('SELECT id FROM branches WHERE is_active = true LIMIT 1');
      req.branchContext = {
        branchId: branchId || defaultBranch.rows[0]?.id,
        userId: null,
        role: 'guest',
        hasFullAccess: false,
        allowedBranches: []
      };
    }

    next();
  } catch (error) {
    console.error('Branch context extraction error:', error);
    req.branchContext = {
      branchId: null,
      userId: null,
      role: 'guest',
      hasFullAccess: false,
      allowedBranches: []
    };
    next();
  }
}

/**
 * Add branch filter to SQL queries
 */
function addBranchFilter(baseQuery, branchContext, tableAlias = '') {
  if (!branchContext || branchContext.hasFullAccess) {
    return baseQuery;
  }

  const prefix = tableAlias ? `${tableAlias}.` : '';
  
  if (branchContext.branchId) {
    return `${baseQuery} AND ${prefix}branch_id = '${branchContext.branchId}'`;
  }
  
  return baseQuery;
}

/**
 * Validate user access to specific branch
 */
async function validateBranchAccess(userId, branchId) {
  try {
    const result = await pool.query(`
      SELECT COUNT(*) as count
      FROM user_branch_assignments
      WHERE user_id = $1 AND branch_id = $2 AND is_active = true
    `, [userId, branchId]);

    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    console.error('Branch access validation error:', error);
    return false;
  }
}

/**
 * Get user's primary branch
 */
async function getUserPrimaryBranch(userId) {
  try {
    const result = await pool.query(`
      SELECT branch_id
      FROM user_branch_assignments
      WHERE user_id = $1 AND is_primary = true AND is_active = true
      LIMIT 1
    `, [userId]);

    return result.rows[0]?.branch_id || null;
  } catch (error) {
    console.error('Get primary branch error:', error);
    return null;
  }
}

module.exports = {
  extractBranchContext,
  addBranchFilter,
  validateBranchAccess,
  getUserPrimaryBranch
};