/**
 * Production Environment Validation
 * Ensures all required environment variables are configured
 */

class ProductionValidator {
  static requiredVars = [
    'JWT_SECRET',
    'NODE_ENV'
  ];

  static securityVars = [
    'BCRYPT_ROUNDS',
    'JWT_EXPIRES_IN',
    'CORS_ORIGINS'
  ];

  static validateEnvironment() {
    const missing = [];
    const warnings = [];

    // Check required variables
    for (const variable of this.requiredVars) {
      if (!process.env[variable]) {
        missing.push(variable);
      }
    }

    // Check security variables
    for (const variable of this.securityVars) {
      if (!process.env[variable]) {
        warnings.push(variable);
      }
    }

    // Validate JWT_SECRET strength
    if (process.env.JWT_SECRET) {
      this.validateJWTSecret(process.env.JWT_SECRET);
    }

    // Handle missing required variables
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please configure these variables before starting the application.'
      );
    }

    // Log warnings for missing optional variables
    if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
      console.warn(`Warning: Missing recommended environment variables: ${warnings.join(', ')}`);
    }
  }

  static validateJWTSecret(secret) {
    if (secret.length < 32) {
      throw new Error('JWT_SECRET must be at least 32 characters long for security');
    }

    if (secret === 'leafyhealth-jwt-secret-2024' || 
        secret === 'your_256_bit_cryptographically_secure_random_key_here') {
      throw new Error('JWT_SECRET must be changed from default value for production security');
    }
  }

  static validateDatabaseConnection() {
    // Check both environment variable and Replit database
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      console.log('DATABASE_URL not found in environment, checking Replit database...');
      // In Replit, database URL is automatically provided
      return;
    }

    try {
      const url = new URL(dbUrl);
      if (!['postgresql:', 'postgres:'].includes(url.protocol)) {
        throw new Error('DATABASE_URL must use postgresql:// protocol');
      }
    } catch (error) {
      throw new Error('DATABASE_URL format is invalid');
    }
  }

  static ensureProductionSecurity() {
    if (process.env.NODE_ENV === 'production') {
      // Ensure secure defaults
      process.env.BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS || '12';
      process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
      
      // Validate CORS origins in production
      if (!process.env.CORS_ORIGINS || process.env.CORS_ORIGINS === '*') {
        console.warn('Warning: CORS_ORIGINS not properly configured for production');
      }
    }
  }
}

module.exports = { ProductionValidator };