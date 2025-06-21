# LeafyHealth Multi-Application Testing Guide

## Overview
Your microservices platform now supports simultaneous testing of all 5 frontend applications through a single URL using sub-path routing. This eliminates Replit's port limitations while maintaining proper architecture compliance.

## Application Access URLs

### Through Multi-App Gateway (Recommended)
- **Super Admin Dashboard**: `https://your-replit.app/`
- **E-commerce Web**: `https://your-replit.app/web/`
- **Mobile Commerce**: `https://your-replit.app/mobile/`
- **Admin Portal**: `https://your-replit.app/admin/`
- **Operations Dashboard**: `https://your-replit.app/ops/`

### Direct Access (Internal Testing)
- Super Admin: `http://localhost:3003`
- E-commerce Web: `http://localhost:3000`
- Mobile Commerce: `http://localhost:3001`
- Admin Portal: `http://localhost:3002`
- Operations Dashboard: `http://localhost:3004`

## API Integration

### Centralized API Gateway
All API calls from any frontend application route through:
```
https://your-replit.app/api/{service-name}
```

### Service Mapping
- Authentication: `/api/auth`
- Company Management: `/api/company-management`
- Catalog Management: `/api/catalog-management`
- Order Management: `/api/order-management`
- Payment Processing: `/api/payment-processing`
- [... all 26 microservices]

## Architecture Benefits

### Single Port Solution
✅ Only port 5000 exposed externally
✅ All 5 applications accessible simultaneously
✅ Proper CORS handling across all apps
✅ Consistent API routing

### Testing Capabilities
✅ End-to-end workflow testing across applications
✅ Multi-role user journey testing
✅ Cross-application data consistency verification
✅ Performance testing under load

## Implementation Details

### Frontend Configuration
All applications configured with:
- Relative API paths (`/api/*`)
- No hardcoded ports
- Shared authentication context
- Common CORS policies

### Gateway Features
- Sub-path routing for frontend apps
- API request proxying to microservices
- Health monitoring for all services
- Graceful error handling

## Testing Workflows

### 1. Customer Journey Testing
1. **E-commerce Web** (`/web/`) - Browse products, add to cart
2. **Mobile Commerce** (`/mobile/`) - Complete purchase on mobile
3. **Operations Dashboard** (`/ops/`) - Track order fulfillment
4. **Admin Portal** (`/admin/`) - Manage inventory updates

### 2. Administrative Testing
1. **Super Admin** (`/`) - System configuration
2. **Admin Portal** (`/admin/`) - Branch management
3. **Operations Dashboard** (`/ops/`) - Delivery coordination

### 3. Cross-Application Authentication
- Single sign-on across all applications
- Role-based access control testing
- Session management verification

## Development Commands

### Start All Applications
```bash
# Starts all 5 frontend apps + backend services
node start-complete-platform.js
```

### Individual Application Control
Each application runs as a separate workflow:
- Ecommerce Web App (port 3000)
- Mobile Commerce App (port 3001)
- Admin Portal (port 3002)
- Super Admin Dashboard (port 3003)
- Operations Dashboard (port 3004)

## Monitoring and Health Checks

### Gateway Health
```bash
curl http://localhost:5000/api/auth/health
```

### Service Status
Gateway provides health status for all 26 microservices and frontend application availability.

## Best Practices

### API Development
- Always use relative paths: `/api/service-name`
- Never hardcode ports or hostnames
- Implement proper error handling for service unavailability

### Frontend Development
- Test through gateway URL structure
- Verify sub-path routing works correctly
- Ensure static assets load properly

### Authentication
- Use centralized authentication service
- Implement proper token validation
- Handle cross-application session management

## Troubleshooting

### Application Not Loading
1. Check if application workflow is running
2. Verify port configuration matches gateway mapping
3. Check gateway logs for routing errors

### API Errors
1. Verify microservice is healthy
2. Check authentication token validity
3. Confirm API path follows `/api/{service}` pattern

### CORS Issues
1. Gateway handles CORS automatically
2. Ensure requests go through gateway
3. Verify origin headers are properly set

This architecture provides a robust, scalable solution for testing all applications simultaneously while maintaining proper microservices compliance and preparing for future VPS migration with subdomain routing.