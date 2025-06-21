# Admin Portal Implementation Plan
## Multi-Branch ERP System - Three-Tier Architecture

### System Architecture Understanding

**Current Implementation Status:**
- ✅ Super Admin Dashboard (Port 3003) - Fully operational
- 🔄 Admin Portal (Port 3002) - To be implemented from scratch  
- 🚫 Customer Portal (Port 5000) - Future implementation

### Existing Super Admin Capabilities (DO NOT OVERRIDE)

#### 1. User Management System ✅ IMPLEMENTED
**Location:** `frontend/apps/super-admin/src/pages/user-management.tsx`

**Current Features:**
- Complete user CRUD operations
- Role assignment: Super Admin, Admin, Manager, Analyst, Customer, Staff, Delivery, Cashier
- App assignment: Super Admin Portal, Admin Portal, Customer Portal, Mobile Delivery App
- Multi-branch user assignment capability
- Status management (active/inactive/suspended)

#### 2. Company & Branch Management ✅ IMPLEMENTED
**Location:** `frontend/apps/super-admin/src/pages/company-management.tsx`

**Current Features:**
- Single company with multiple branches
- Branch-specific data isolation
- Company profile management (GST, FSSAI, PAN, CIN, MSME, Trade License)
- Branch details (address, coordinates, manager, operating hours)
- Geographic branch assignment

#### 3. Role-Permission Matrix ✅ IMPLEMENTED
**Location:** `frontend/apps/super-admin/src/pages/permission-assignment.tsx`

**Current Features:**
- Microservice-level permission assignment
- CRUD permissions per microservice
- Default permission sets for admin_portal and operations_dashboard
- Dynamic permission management for 24+ microservices

#### 4. Security & RBAC ✅ IMPLEMENTED
**Location:** `shared/middleware/rbac.js`

**Current Features:**
- JWT authentication with branch context
- Role-based access control across all microservices
- Branch-specific data filtering
- Audit logging with IP tracking
- Rate limiting (5 attempts per 15 minutes)

### Admin Portal Requirements

#### Core Architecture Principles
1. **Hierarchical Control:** Super Admin controls all Admin Portal sidebar components
2. **Branch Isolation:** Admin users see only their assigned branch data
3. **Dynamic Permissions:** Sidebar items appear based on Super Admin assignments
4. **Authentication Flow:** Same JWT pattern as Super Admin
5. **No Direct Access:** All permissions flow through Super Admin

#### Admin Portal Implementation Structure

```
frontend/apps/admin-portal/
├── src/
│   ├── pages/
│   │   ├── login.tsx                    # Branch admin authentication
│   │   ├── dashboard.tsx                # Branch-specific dashboard
│   │   ├── inventory/                   # If assigned by Super Admin
│   │   ├── orders/                      # If assigned by Super Admin
│   │   ├── customers/                   # If assigned by Super Admin
│   │   ├── analytics/                   # If assigned by Super Admin
│   │   └── profile.tsx                  # User profile management
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx          # Main layout with dynamic sidebar
│   │   │   ├── DynamicSidebar.tsx       # Renders based on Super Admin permissions
│   │   │   └── BranchHeader.tsx         # Shows current branch context
│   │   └── auth/
│   │       ├── AdminAuth.tsx            # Admin authentication logic
│   │       └── BranchGuard.tsx          # Branch-specific access control
│   ├── stores/
│   │   ├── adminAuthStore.ts            # Admin authentication state
│   │   ├── branchStore.ts               # Branch context management
│   │   └── permissionStore.ts           # Dynamic permission loading
│   └── lib/
│       ├── adminApi.ts                  # Branch-specific API calls
│       └── permissions.ts               # Permission validation
```

#### Dynamic Sidebar Implementation

The sidebar will be completely controlled by Super Admin through the existing permission system:

**Super Admin Controls:**
1. **Microservice Assignment:** Which microservices the admin can access
2. **Permission Level:** CRUD permissions per microservice
3. **Branch Assignment:** Which branches the admin manages
4. **Sidebar Visibility:** Dynamic rendering based on permissions

**Admin Portal Sidebar Logic:**
```typescript
// Example: Sidebar items appear only if assigned by Super Admin
const sidebarItems = [
  {
    name: 'Inventory Management',
    icon: 'Package',
    path: '/inventory',
    microservice: 'inventory-management',
    requiredPermission: 'read'
  },
  {
    name: 'Order Management', 
    icon: 'ShoppingCart',
    path: '/orders',
    microservice: 'order-management',
    requiredPermission: 'read'
  },
  // ... other items based on Super Admin assignment
];

// Filter based on user permissions from Super Admin
const visibleItems = sidebarItems.filter(item => 
  userPermissions[item.microservice]?.[item.requiredPermission]
);
```

#### Authentication Flow

1. **Admin Login:** Branch admin logs in through Admin Portal
2. **Token Validation:** JWT token includes branch context
3. **Permission Loading:** Load permissions assigned by Super Admin
4. **Sidebar Generation:** Dynamic sidebar based on permissions
5. **Data Filtering:** All data filtered by assigned branch

#### Branch Data Isolation

**Implementation:**
- All API calls include branch context from JWT token
- Database queries automatically filter by branch_id
- Admin users cannot access other branch data
- Cross-branch operations require Super Admin elevation

#### Key Features to Implement

1. **Branch-Specific Dashboard**
   - Branch performance metrics
   - Recent orders and activities
   - Inventory alerts
   - Staff management

2. **Dynamic Module Access**
   - Inventory management (if assigned)
   - Order processing (if assigned)
   - Customer service (if assigned)
   - Analytics reports (if assigned)
   - Accounting functions (if assigned)

3. **User Profile Management**
   - Admin profile editing
   - Password change
   - Session management
   - Activity history

4. **Branch Operations**
   - Staff scheduling
   - Branch-specific settings
   - Local inventory control
   - Customer communications

### Implementation Phases

#### Phase 1: Core Authentication & Layout
- Admin authentication system
- JWT integration with branch context
- Basic layout with dynamic sidebar
- Permission loading from Super Admin

#### Phase 2: Dynamic Sidebar & Routing
- Permission-based sidebar generation
- Protected route implementation
- Branch context management
- Error handling for unauthorized access

#### Phase 3: Core Modules
- Dashboard with branch metrics
- User profile management
- Basic inventory view (if permitted)
- Order management (if permitted)

#### Phase 4: Advanced Features
- Real-time notifications
- Advanced analytics (if permitted)
- Reporting functions (if permitted)
- Audit trail integration

### Technical Considerations

#### Database Schema Requirements
- No changes to existing Super Admin schema
- Utilize existing user_branch_assignments table
- Leverage existing role_permissions system
- Use current audit_logs for tracking

#### API Integration
- Use existing Authentication Service (Port 8085)
- Integrate with existing microservices
- Respect existing RBAC middleware
- Maintain branch filtering in all queries

#### Security Implementation
- Same JWT validation as Super Admin
- Branch-specific data filtering
- Permission validation on every request
- Audit logging for all actions

### Success Criteria

1. **Functional Requirements:**
   - Admin can login with branch context
   - Sidebar shows only Super Admin assigned modules
   - All data filtered by admin's branch
   - Permissions enforced on all operations

2. **Security Requirements:**
   - No cross-branch data access
   - All permissions flow through Super Admin
   - Complete audit trail
   - Secure session management

3. **User Experience:**
   - Intuitive branch-specific interface
   - Clear permission boundaries
   - Responsive design matching Super Admin
   - Seamless integration with existing system

### Approval Required

This implementation plan respects all existing Super Admin functionality and builds upon the current permission system without overriding any existing features.

**Ready to proceed with implementation?**
- Phase 1: Core authentication and layout structure
- Estimated completion: 2-3 hours for complete Admin Portal
- All work will be done within existing architecture constraints