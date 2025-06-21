/**
 * RBAC Integration Script for All 24 Microservices
 * Automatically integrates role-based access control across all services
 */

const fs = require('fs');
const path = require('path');

// Microservice endpoints and their required permissions
const microservicePermissions = {
  'accounting-management': {
    port: 3014,
    permissions: {
      'GET /accounting-management/accounts': 'view_reports',
      'POST /accounting-management/accounts': 'manage_reports',
      'PUT /accounting-management/accounts/:id': 'manage_reports',
      'DELETE /accounting-management/accounts/:id': 'manage_reports',
      'GET /accounting-management/expenses': 'view_reports',
      'POST /accounting-management/expenses': 'manage_reports',
      'PUT /accounting-management/expenses/:id': 'manage_reports',
      'DELETE /accounting-management/expenses/:id': 'manage_reports'
    }
  },
  'analytics-reporting': {
    port: 3015,
    permissions: {
      'GET /analytics/sales': 'view_reports',
      'GET /analytics/customers': 'view_customers',
      'GET /analytics/products': 'view_products',
      'GET /analytics/dashboard': 'view_dashboard',
      'GET /reports/sales': 'view_reports',
      'GET /reports/customers': 'view_customers',
      'GET /reports/inventory': 'view_inventory'
    }
  },
  'catalog-management': {
    port: 3016,
    permissions: {
      'GET /catalog/products': 'view_products',
      'POST /catalog/products': 'manage_products',
      'PUT /catalog/products/:id': 'manage_products',
      'DELETE /catalog/products/:id': 'manage_products',
      'GET /catalog/categories': 'view_products',
      'POST /catalog/categories': 'manage_products'
    }
  },
  'content-management': {
    port: 3018,
    permissions: {
      'GET /contentmanagement/content': 'view_dashboard',
      'POST /contentmanagement/content': 'manage_system',
      'PUT /contentmanagement/content/:id': 'manage_system',
      'DELETE /contentmanagement/content/:id': 'manage_system'
    }
  },
  'customer-service': {
    port: 3019,
    permissions: {
      'GET /customers': 'view_customers',
      'POST /customers': 'manage_customers',
      'PUT /customers/:id': 'manage_customers',
      'DELETE /customers/:id': 'manage_customers',
      'GET /customers/stats': 'view_reports'
    }
  },
  'employee-management': {
    port: 3020,
    permissions: {
      'GET /employee-management/employees': 'view_employees',
      'POST /employee-management/employees': 'manage_employees',
      'PUT /employee-management/employees/:id': 'manage_employees',
      'DELETE /employee-management/employees/:id': 'manage_employees'
    }
  },
  'expense-monitoring': {
    port: 3021,
    permissions: {
      'GET /expenses': 'view_reports',
      'POST /expenses': 'manage_reports',
      'PUT /expenses/:id': 'manage_reports',
      'DELETE /expenses/:id': 'manage_reports',
      'GET /budgets': 'view_reports',
      'POST /budgets': 'manage_reports'
    }
  },
  'inventory-management': {
    port: 3022,
    permissions: {
      'GET /inventory': 'view_inventory',
      'POST /inventory': 'manage_inventory',
      'PUT /inventory/:id': 'manage_inventory',
      'DELETE /inventory/:id': 'manage_inventory',
      'GET /inventory/alerts': 'view_inventory'
    }
  },
  'logistics-delivery': {
    port: 3023,
    permissions: {
      'GET /logistics/deliveries': 'view_orders',
      'POST /logistics/deliveries': 'manage_orders',
      'PUT /logistics/deliveries/:id': 'manage_orders',
      'GET /logistics/routes': 'view_orders'
    }
  },
  'notification-system': {
    port: 3024,
    permissions: {
      'GET /notifications': 'view_dashboard',
      'POST /notifications': 'manage_system',
      'PUT /notifications/:id': 'manage_system'
    }
  },
  'order-management': {
    port: 3025,
    permissions: {
      'GET /orders': 'view_orders',
      'POST /orders': 'manage_orders',
      'PUT /orders/:id': 'manage_orders',
      'DELETE /orders/:id': 'manage_orders',
      'GET /orders/stats': 'view_reports'
    }
  },
  'payment-processing': {
    port: 3031,
    permissions: {
      'GET /payments': 'view_orders',
      'POST /payments': 'manage_orders',
      'PUT /payments/:id': 'manage_orders'
    }
  },
  'product-management': {
    port: 3026,
    permissions: {
      'GET /products': 'view_products',
      'POST /products': 'manage_products',
      'PUT /products/:id': 'manage_products',
      'DELETE /products/:id': 'manage_products'
    }
  },
  'quality-assurance': {
    port: 3027,
    permissions: {
      'GET /quality': 'view_products',
      'POST /quality': 'manage_products',
      'PUT /quality/:id': 'manage_products'
    }
  },
  'recommendation-engine': {
    port: 3028,
    permissions: {
      'GET /recommendations': 'view_products',
      'POST /recommendations': 'manage_products'
    }
  },
  'search-indexing': {
    port: 3029,
    permissions: {
      'GET /search': 'view_products',
      'POST /search/index': 'manage_products',
      'PUT /search/reindex': 'manage_products'
    }
  },
  'seasonal-promotions': {
    port: 3030,
    permissions: {
      'GET /promotions': 'view_products',
      'POST /promotions': 'manage_products',
      'PUT /promotions/:id': 'manage_products',
      'DELETE /promotions/:id': 'manage_products'
    }
  },
  'shipping-delivery': {
    port: 3034,
    permissions: {
      'GET /shipping': 'view_orders',
      'POST /shipping': 'manage_orders',
      'PUT /shipping/:id': 'manage_orders'
    }
  },
  'subscription-management': {
    port: 3036,
    permissions: {
      'GET /api/subscriptions': 'view_customers',
      'POST /api/subscriptions': 'manage_customers',
      'PUT /api/subscriptions/:id': 'manage_customers',
      'DELETE /api/subscriptions/:id': 'manage_customers'
    }
  },
  'supply-chain': {
    port: 3032,
    permissions: {
      'GET /supply-chain': 'view_inventory',
      'POST /supply-chain': 'manage_inventory',
      'PUT /supply-chain/:id': 'manage_inventory'
    }
  },
  'tax-compliance': {
    port: 3033,
    permissions: {
      'GET /tax': 'view_reports',
      'POST /tax': 'manage_reports',
      'PUT /tax/:id': 'manage_reports'
    }
  },
  'user-role-management': {
    port: 3035,
    permissions: {
      'GET /users': 'manage_employees',
      'POST /users': 'manage_employees',
      'PUT /users/:id': 'manage_employees',
      'DELETE /users/:id': 'manage_employees',
      'POST /users/:id/assign-role': 'manage_system'
    }
  },
  'vendor-management': {
    port: 3037,
    permissions: {
      'GET /vendors': 'view_inventory',
      'POST /vendors': 'manage_inventory',
      'PUT /vendors/:id': 'manage_inventory',
      'DELETE /vendors/:id': 'manage_inventory'
    }
  },
  'warehouse-management': {
    port: 3038,
    permissions: {
      'GET /warehouse': 'view_inventory',
      'POST /warehouse': 'manage_inventory',
      'PUT /warehouse/:id': 'manage_inventory'
    }
  }
};

/**
 * Generate RBAC middleware integration code for NestJS services
 */
function generateNestJSRBACIntegration(serviceName, permissions) {
  return `
/**
 * RBAC Integration for ${serviceName}
 * Auto-generated middleware integration
 */

import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const PERMISSION_KEY = 'permission';
export const Permission = (permission: string) => SetMetadata(PERMISSION_KEY, permission);

interface UserPayload {
  id: string;
  role: string;
  branchId?: string;
  type: string;
  isActive: boolean;
}

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true; // No permission required
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authentication token required');
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
      const JWT_SECRET = process.env.JWT_SECRET || 'leafyhealth-multi-branch-secret';
      const userPayload: UserPayload = jwt.verify(token, JWT_SECRET) as UserPayload;

      if (!userPayload.isActive) {
        throw new ForbiddenException('Account is deactivated');
      }

      // Check permission (simplified for integration)
      const hasPermission = await this.checkUserPermission(userPayload, requiredPermission);
      
      if (!hasPermission) {
        throw new ForbiddenException('Insufficient permissions for this action');
      }

      // Add user context to request
      request.user = userPayload;
      request.userBranchId = userPayload.branchId;
      request.userRole = userPayload.role;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private async checkUserPermission(user: UserPayload, permission: string): Promise<boolean> {
    // Super admin has all permissions
    if (user.role === 'super_admin') {
      return true;
    }

    // Role-based permission mapping (simplified)
    const rolePermissions = {
      'admin': ['view_dashboard', 'view_products', 'manage_products', 'view_orders', 'manage_orders', 'view_customers', 'manage_customers', 'view_inventory', 'manage_inventory', 'view_employees', 'manage_employees', 'view_reports', 'manage_reports'],
      'manager': ['view_dashboard', 'view_products', 'manage_products', 'view_orders', 'manage_orders', 'view_customers', 'manage_customers', 'view_inventory', 'manage_inventory', 'view_reports'],
      'staff': ['view_dashboard', 'view_products', 'view_orders', 'view_customers', 'view_inventory']
    };

    return rolePermissions[user.role]?.includes(permission) || false;
  }
}
`;
}

/**
 * Generate controller decorators for specific endpoints
 */
function generateControllerDecorators(permissions) {
  let decorators = '';
  for (const [endpoint, permission] of Object.entries(permissions)) {
    const [method, path] = endpoint.split(' ');
    decorators += `
  // Apply to ${method} ${path}
  @Permission('${permission}')
  @UseGuards(RBACGuard)`;
  }
  return decorators;
}

module.exports = {
  microservicePermissions,
  generateNestJSRBACIntegration,
  generateControllerDecorators
};