import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Pool } from 'pg';

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    id: string;
    email: string;
    role: string;
    branch_id?: string;
    permissions: string[];
  };
}

export interface TokenValidationResult {
  valid: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
    branch_id?: string;
    permissions: string[];
  };
  error?: string;
}

@Injectable()
export class CentralAuthService {
  private db: Pool;

  constructor(private jwtService: JwtService) {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  /**
   * Centralized token validation for all microservices
   */
  async validateToken(token: string): Promise<TokenValidationResult> {
    try {
      if (!token) {
        return { valid: false, error: 'No token provided' };
      }

      const cleanToken = token.replace('Bearer ', '');
      const payload = this.jwtService.verify(cleanToken);
      
      const user = await this.getUserWithPermissions(payload.sub, payload.userType);
      
      if (!user) {
        return { valid: false, error: 'User not found' };
      }

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          branch_id: user.branch_id,
          permissions: user.permissions,
        },
      };
    } catch (error) {
      return { 
        valid: false, 
        error: error.message || 'Invalid token' 
      };
    }
  }

  /**
   * Customer authentication
   */
  async authenticateCustomer(email: string, password: string): Promise<AuthToken> {
    const result = await this.db.query(`
      SELECT u.*, c.branch_id 
      FROM auth.users u
      LEFT JOIN customers.customers c ON u.id = c.user_id
      WHERE u.email = $1 AND u.is_verified = true
    `, [email]);

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result.rows[0];
    
    if (!await bcrypt.compare(password, user.password_hash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const permissions = ['order:create', 'order:read', 'cart:manage', 'profile:manage'];
    
    return this.generateTokens(user.id, 'customer', permissions, user.branch_id);
  }

  /**
   * Internal user authentication
   */
  async authenticateInternalUser(email: string, password: string): Promise<AuthToken> {
    const result = await this.db.query(`
      SELECT iu.*, 
             ARRAY_AGG(DISTINCT p.name) as permissions
      FROM auth.internal_users iu
      LEFT JOIN auth.user_roles ur ON iu.id = ur.user_id
      LEFT JOIN auth.roles r ON ur.role_id = r.id
      LEFT JOIN auth.role_permissions rp ON r.id = rp.role_id
      LEFT JOIN auth.permissions p ON rp.permission_id = p.id
      WHERE iu.email = $1 AND iu.is_active = true
      GROUP BY iu.id
    `, [email]);

    if (result.rows.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const internalUser = result.rows[0];
    
    if (!await bcrypt.compare(password, internalUser.password_hash)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const permissions = internalUser.permissions || [];

    return this.generateTokens(
      internalUser.id, 
      internalUser.role, 
      permissions, 
      internalUser.branch_id
    );
  }

  /**
   * Generate JWT tokens
   */
  private generateTokens(
    userId: string, 
    userType: string, 
    permissions: string[], 
    branchId?: string
  ): AuthToken {
    const payload = {
      sub: userId,
      userType,
      permissions,
      branch_id: branchId,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(
      { sub: userId, userType, type: 'refresh' },
      { expiresIn: '7d' }
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900,
      user: {
        id: userId,
        email: '',
        role: userType,
        branch_id: branchId,
        permissions,
      },
    };
  }

  /**
   * Get user with permissions from database
   */
  private async getUserWithPermissions(userId: string, userType: string) {
    if (userType === 'customer') {
      const result = await this.db.query(`
        SELECT u.*, c.branch_id 
        FROM auth.users u
        LEFT JOIN customers.customers c ON u.id = c.user_id
        WHERE u.id = $1
      `, [userId]);
      
      const user = result.rows[0];
      return user ? {
        id: user.id,
        email: user.email,
        role: 'customer',
        branch_id: user.branch_id,
        permissions: ['order:create', 'order:read', 'cart:manage', 'profile:manage'],
      } : null;
    } else {
      const result = await this.db.query(`
        SELECT iu.*, 
               ARRAY_AGG(DISTINCT p.name) as permissions
        FROM auth.internal_users iu
        LEFT JOIN auth.user_roles ur ON iu.id = ur.user_id
        LEFT JOIN auth.roles r ON ur.role_id = r.id
        LEFT JOIN auth.role_permissions rp ON r.id = rp.role_id
        LEFT JOIN auth.permissions p ON rp.permission_id = p.id
        WHERE iu.id = $1
        GROUP BY iu.id
      `, [userId]);

      const internalUser = result.rows[0];
      if (!internalUser) return null;

      return {
        id: internalUser.id,
        email: internalUser.email,
        role: internalUser.role,
        branch_id: internalUser.branch_id,
        permissions: internalUser.permissions || [],
      };
    }
  }

  /**
   * Validate user permissions
   */
  async validatePermission(userId: string, userType: string, permission: string): Promise<boolean> {
    const user = await this.getUserWithPermissions(userId, userType);
    return user ? user.permissions.includes(permission) : false;
  }

  /**
   * Get user branch context for data isolation
   */
  async getUserBranchContext(userId: string, userType: string): Promise<string | null> {
    const user = await this.getUserWithPermissions(userId, userType);
    return user ? user.branch_id : null;
  }
}