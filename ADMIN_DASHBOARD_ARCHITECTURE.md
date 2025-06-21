# LeafyHealth Admin Dashboard Architecture
## Single Application with Dual Dashboard System

### Current Implementation Status: COMPLETED

The LeafyHealth platform uses a single Super Admin application (`frontend/apps/super-admin/`) with dual dashboards accessed through email-based routing.

## Access Credentials & Routing

### Global Super Admin
- **Email**: `global.admin@leafyhealth.com`
- **Password**: `securepassword123`
- **Route**: `/system-dashboard`
- **Implementation**: `system-dashboard.tsx`

### Operational Super Admin
- **Email**: `ops.admin@leafyhealth.com`
- **Password**: `securepassword123`  
- **Route**: `/operational-dashboard`
- **Implementation**: `operational-dashboard.tsx`

## Dashboard Interfaces

### Global Super Admin Dashboard
**Purpose**: Technical system administration and microservice management

**Interface Features**:
- 26 microservices organized in 7 categories
- Real-time service health monitoring
- Response time tracking and system metrics
- Professional header layout with logout functionality
- Technical configuration and troubleshooting tools

**Categories**:
1. Core Services (3 services)
2. Business Management (3 services)  
3. Operations (4 services)
4. Analytics & Reporting (3 services)
5. Content & Media (3 services)
6. Integration & Compliance (3 services)
7. System Support (7 services)

### Operational Super Admin Dashboard
**Purpose**: Business domain management and operational workflows

**Interface Features**:
- 6 business domain tabs with horizontal navigation
- Composite workflows combining multiple microservices
- Business-focused operations and management
- Integrated data from related services

**Business Domains**:
1. Product Ecosystem Management
2. Order Operations Center
3. Customer Relationship Hub
4. Financial Control Center
5. Organization Management Hub
6. Business Intelligence Center

## Routing Logic Implementation

The routing is implemented in `frontend/apps/super-admin/src/pages/index.tsx`:

```typescript
// Email-based routing for dual dashboard system
if (user?.email?.includes('ops.admin') || user?.email?.includes('branch') || user?.email?.includes('operations')) {
  // Operational Super Admin - Business Domain Dashboard
  router.replace('/operational-dashboard');
} else {
  // Global Super Admin - Technical Microservice Dashboard  
  router.replace('/system-dashboard');
}
```

## Network Architecture

### Single Entry Point
- **External Access**: Port 5000 only via Unified Gateway
- **Internal Management**: All microservices on internal ports (3013-3036, 8081, 8085)
- **Frontend Application**: Port 3003 (internal, managed by gateway)

### Service Architecture
- **Unified Gateway**: `server/unified-gateway.js` (Port 5000)
- **Authentication Service**: `server/authentication-service.js` (Port 8085)
- **Direct Data Gateway**: `server/direct-data-gateway.js` (Port 8081)
- **26 Backend Microservices**: Ports 3013-3036

## Documentation Alignment

This document supersedes conflicting role definitions in:
- `README.DEV.md` - Updated to reflect dual dashboard system
- `COMPOSITE_BUSINESS_DOMAIN_ARCHITECTURE.md` - Updated with implementation status
- `UNIFIED_NETWORKING_ARCHITECTURE.md` - Updated with correct dashboard routes

## Key Implementation Details

1. **Single Application**: One Super Admin app with two different interfaces
2. **Email-Based Routing**: Automatic dashboard selection based on login credentials
3. **Professional UI**: Clean header layouts with proper logout functionality
4. **Real Data Integration**: All dashboards use authentic data from backend services
5. **Unified Network**: Single port 5000 for all external access via gateway

This architecture eliminates the confusion between "Global", "Super", and "Operational" admin concepts by clearly defining two specific dashboards with distinct purposes and access patterns.