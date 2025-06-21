# Unified Networking Architecture - LeafyHealth Platform

## Overview
The LeafyHealth platform now operates through a single unified gateway on port 5000, eliminating port conflicts and providing clean access to all services.

## Current Architecture

### Single Entry Point
- **Primary URL**: Port 5000 only
- **All frontend applications**: Served through unified gateway
- **All backend APIs**: Routed through unified gateway
- **No direct port access**: All other ports are internal only

### Port Configuration

#### Active External Port
- **5000**: Unified Gateway (ONLY external access point)

#### Internal Backend Ports (No External Access)
- **8085**: Authentication Service
- **8081**: Direct Data Gateway  
- **3013**: Company Management Service
- **3014-3036**: 23 Additional Microservices

#### Internal Frontend Port (Managed by Gateway)
- **3003**: Super Admin Dashboard (started internally by gateway)

### Removed Conflicting Ports
The following ports have been REMOVED to eliminate networking conflicts:
- ~~3000~~: Ecommerce Web App (REMOVED)
- ~~3001~~: Mobile Commerce App (REMOVED) 
- ~~3002~~: Admin Portal (REMOVED)
- ~~3004~~: Operations Dashboard (REMOVED)

## Access Patterns

### Frontend Access
- **Super Admin Dashboard**: `https://your-domain:5000/`
- **Login**: `https://your-domain:5000/login`
- **Operations Dashboard**: `https://your-domain:5000/operational-dashboard`

### API Access
All APIs accessible through: `https://your-domain:5000/api/[service-name]/[endpoint]`

Examples:
- Authentication: `https://your-domain:5000/api/auth/internal/login`
- User Management: `https://your-domain:5000/api/user-role-management/users`
- Direct Data: `https://your-domain:5000/api/direct-data/products`

## Admin Account Configuration

### Global Super Admin
- **Email**: global.admin@leafyhealth.com
- **Password**: securepassword123
- **Dashboard**: `/system-dashboard` - Technical microservice grid (26 services)
- **Interface**: Microservice categories with health monitoring
- **Permissions**: Complete system control and technical configuration

### Operational Super Admin  
- **Email**: ops.admin@leafyhealth.com
- **Password**: securepassword123
- **Dashboard**: `/operational-dashboard` - Business domain tabs (6 domains)
- **Interface**: Product Ecosystem, Order Operations, Customer Relations, Financial Control, Organization Hub, Business Intelligence
- **Permissions**: Business operations management and workflow oversight

## Network Security

### CORS Configuration
- Allows all Replit domains (*.replit.dev, *.replit.app)
- Supports localhost for development
- Credentials enabled for authenticated requests

### Security Headers
- Content Security Policy enforced
- XSS protection enabled
- Frame protection configured
- HTTPS redirect enabled

## Backend Services

### Active Services (26 Total)
1. Authentication Service (8085)
2. Direct Data Gateway (8081)  
3. Company Management (3013)
4. Identity Access (3020)
5. User Role Management (3035)
6. Catalog Management (3022)
7. Inventory Management (3025)
8. Order Management (3023)
9. Payment Processing (3026)
10. Shipping Delivery (3034)
11. Customer Service (3024)
12. Notification Service (3031)
13. Employee Management (3028)
14. Accounting Management (3014)
15. Expense Monitoring (3021)
16. Analytics Reporting (3015)
17. Performance Monitor (3029)
18. Reporting Management (3032)
19. Content Management (3017)
20. Image Management (3030)
21. Label Design (3027)
22. Marketplace Management (3033)
23. Subscription Management (3036)
24. Multi-Language Management (3019)
25. Compliance Audit (3016)
26. Integration Hub (3018)

## Troubleshooting

### Port Conflicts
If you see port conflicts:
1. Ensure only the Unified Gateway (port 5000) is running
2. All other frontend ports should be stopped
3. Backend services run on their assigned internal ports

### Preview Connection Issues
If Replit Preview doesn't connect:
1. Access via Network tab in Replit
2. Open port 5000 directly
3. Use external browser for testing

### Authentication Issues
1. Verify credentials in login page
2. Check backend service status
3. Review authentication logs in gateway

## Development Notes

### Adding New Services
1. Add service to SERVICES registry in unified-gateway.js
2. Assign unique port number
3. Configure API routing pattern

### Modifying Frontend
1. Only super-admin frontend is active
2. All routes served through single application
3. Role-based rendering handles different admin types

## Production Checklist

- [ ] Only port 5000 exposed externally
- [ ] All backend services running on internal ports
- [ ] Authentication working for both admin types
- [ ] API routing functional for all 26 services
- [ ] Security headers properly configured
- [ ] CORS configured for production domains