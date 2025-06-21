/**
 * Security Headers Middleware
 * Adds security headers and sanitizes error responses
 */

function addSecurityHeaders() {
  return (req, res, next) => {
    // Remove server identification
    res.removeHeader('X-Powered-By');
    
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    
    next();
  };
}

function sanitizeError(error, req, res, next) {
  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  
  // Extract status code if available
  if (error.statusCode) {
    statusCode = error.statusCode;
  } else if (error.status) {
    statusCode = error.status;
  }
  
  // Sanitize error messages for production
  if (process.env.NODE_ENV === 'production') {
    const safeMessages = {
      400: 'Bad request',
      401: 'Authentication required',
      403: 'Access denied',
      404: 'Resource not found',
      409: 'Conflict',
      422: 'Invalid input data',
      429: 'Too many requests',
      500: 'Internal server error',
      502: 'Service unavailable',
      503: 'Service temporarily unavailable'
    };
    
    message = safeMessages[statusCode] || 'An error occurred';
  } else {
    message = error.message || message;
  }
  
  const sanitizedError = {
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.url
  };
  
  res.status(statusCode).json(sanitizedError);
}

module.exports = {
  addSecurityHeaders,
  sanitizeError
};