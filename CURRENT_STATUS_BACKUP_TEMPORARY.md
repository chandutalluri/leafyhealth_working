# Current Status Backup - Temporary Reference Document

**WARNING: This is a temporary document for understanding current connections. Will be deleted after completion.**

## Current Replit Configuration Analysis

### Port Mapping Issues (From .replit file)
```
# PROBLEMATIC EXTERNAL MAPPINGS:
[[ports]]
localPort = 3013
externalPort = 9000  # ← CONFLICT: Company Management mapped to 9000

[[ports]]
localPort = 5000
externalPort = 5000  # ← CORRECT: Unified Gateway

[[ports]]
localPort = 8081
externalPort = 8081  # ← SECURITY ISSUE: Direct Data Gateway exposed

[[ports]]
localPort = 8085
externalPort = 8080  # ← SECURITY ISSUE: Auth Service exposed
```

### Current Service Architecture
```
EXTERNAL ACCESS:
├── Port 5000 → Unified Gateway (CORRECT)
├── Port 8080 → Authentication Service (INSECURE - should be internal)
├── Port 8081 → Direct Data Gateway (INSECURE - should be internal)
└── Port 9000 → Company Management (CONFLICT - multiple services claiming this)

INTERNAL SERVICES (should remain internal):
├── Port 3003 → Next.js Frontend (but auto-mapped to 9000)
├── Port 3013 → Company Management Service
├── Port 3014-3036 → 23 Business Microservices
├── Port 8081 → Direct Data Gateway
└── Port 8085 → Authentication Service
```

### Identified Problems

#### 1. Port Conflict Issue
- Next.js on port 3003 is being externally mapped to port 9000
- Company Management on port 3013 is also configured for external port 9000
- This creates routing confusion and service conflicts

#### 2. Security Vulnerabilities
- Direct Data Gateway (8081) exposed externally
- Authentication Service (8085) exposed externally  
- These should only be accessible through Unified Gateway

#### 3. Microservice Port Allocation Failures
- Multiple services showing "No ports available"
- Indicates port allocation conflicts in Replit environment
- Services competing for same port ranges

#### 4. Next.js Auto-Discovery Problem
- Next.js automatically requesting external port access
- Creating unwanted external mappings despite internal-only configuration
- Cross-origin warnings in console logs

### Current Working Components
- All 24 microservices successfully starting
- Unified Gateway operational on port 5000
- Database connections stable
- Authentication system functional
- API routing partially working

### Root Cause
The `.replit` file contains multiple external port declarations that conflict with the intended single-entry-point architecture. Replit's automatic port discovery is creating external mappings for services that should remain internal.

### Service Dependencies Map
```
Frontend (port 3003)
    ↓
Unified Gateway (port 5000) ← SINGLE ENTRY POINT
    ↓
├── Authentication Service (port 8085)
├── Direct Data Gateway (port 8081)  
├── Company Management (port 3013)
├── Identity Access (port 3020)
├── User Role Management (port 3035)
├── Catalog Management (port 3022)
├── Inventory Management (port 3025)
├── Order Management (port 3030)
├── Payment Processing (port 3031)
├── Shipping Delivery (port 3034)
├── Customer Service (port 3024)
├── Notification Service (port 3032)
├── Employee Management (port 3028)
├── Accounting Management (port 3014)
├── Expense Monitoring (port 3021)
├── Analytics Reporting (port 3015)
├── Performance Monitor (port 3029)
├── Reporting Management (port 3033)
├── Content Management (port 3017)
├── Image Management (port 3023)
├── Label Design (port 3027)
├── Marketplace Management (port 3036)
├── Subscription Management (port 3036)
├── Multi Language Management (port 3019)
├── Compliance Audit (port 3016)
└── Integration Hub (port 3018)
```

### Current Workflows Running
1. **Company Management Service** - Port 3013 (NestJS)
2. **All Backend Microservices** - Ports 3014-3036 (23 services)
3. **Authentication Service** - Port 8085 (Node.js)
4. **Direct Data Gateway** - Port 8081 (Node.js)
5. **Unified Gateway** - Port 5000 (Node.js + Express)

### Authentication Configuration
- Global Super Admin: `global.admin@leafyhealth.com` / `securepassword123`
- Operational Admin: `ops.admin@leafyhealth.com` / `securepassword123`
- JWT-based authentication through port 8085
- Role-based access control implemented

### Database Configuration
- PostgreSQL database operational
- Environment variables properly configured
- All microservices connecting successfully
- Data isolation by branch implemented

### Next.js Frontend Configuration
```javascript
// Current next.config.js issues:
module.exports = {
  ...nextConfigBase,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*'
      }
    ];
  }
};
```

### Required Changes for Production
1. Remove all external port mappings except port 5000
2. Configure all services for localhost-only binding
3. Update Next.js to prevent auto-port discovery
4. Implement proper service orchestration
5. Add Docker and Traefik configurations

---
**END OF TEMPORARY BACKUP DOCUMENT**