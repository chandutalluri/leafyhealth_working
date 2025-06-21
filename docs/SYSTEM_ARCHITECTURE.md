# LeafyHealth System Architecture

## Platform Overview
LeafyHealth is a microservices-based eCommerce platform designed for organic grocery delivery, featuring a distributed architecture with 24 backend services and 5 frontend applications.

## Frontend Architecture

### Application Structure (Monorepo)
```
frontend/
├── apps/
│   ├── ecommerce-web/      # Customer-facing web application (Port 5000)
│   ├── ecommerce-mobile/   # Mobile-responsive version
│   ├── admin-portal/       # Business administration (Port 3002)
│   ├── super-admin/        # System administration (Port 3003)
│   └── ops-delivery/       # Operations dashboard (Port 3004)
├── packages/
│   ├── ui-kit/            # Shared UI components
│   ├── api-client/        # API integration layer
│   ├── auth/              # Authentication utilities
│   ├── config/            # Configuration management
│   ├── domain-registry/   # Service discovery
│   └── utils/             # Common utilities
```

### Frontend Technology Stack
- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript 5.2.2 for type safety
- **Styling**: Tailwind CSS 3.3.6 with glassmorphism design
- **UI Components**: Radix UI complete component library
- **State Management**: Zustand 4.4.7 for global state
- **Forms**: React Hook Form 7.47.0 with Zod 3.22.4 validation
- **Animations**: Framer Motion 10.16.5 for smooth interactions
- **Data Fetching**: TanStack React Query 5.8.4
- **Icons**: Heroicons 2.0.18 + Lucide React 0.294.0
- **Notifications**: React Hot Toast 2.4.1
- **Build System**: Turborepo for monorepo management
- **Package Manager**: pnpm workspace configuration

### Backend Technology Stack
- **Framework**: NestJS 11.1.3 (Node.js 20.18.1)
- **Language**: TypeScript 5.1.3
- **Database**: PostgreSQL 15+ with Drizzle ORM 0.29.1
- **Authentication**: JWT 11.0.0 with Passport.js 10.0.2
- **API Documentation**: Swagger/OpenAPI 11.2.0
- **Validation**: Class-validator 0.14.0 & Class-transformer 0.5.1
- **Configuration**: @nestjs/config 4.0.2
- **Database Connection**: postgres 3.4.3 driver
- **Container**: Docker support with multi-stage builds
- **Architecture**: Domain-driven microservices (24 services)

### Frontend Applications Detail

#### 1. Ecommerce Web (Port 5000)
**Primary customer-facing application**
- Product catalog and search functionality
- Shopping cart and checkout process
- User account management
- Order tracking and history
- Customer support integration
- **Domains**: catalog-management, order-management, customer-service, notification-service, content-management, analytics-reporting, label-design, marketplace-management

#### 2. Admin Portal (Port 3002)
**Business administration interface**
- Financial management and accounting
- Expense monitoring and budgeting
- Payment processing oversight
- **Domains**: accounting-management, expense-monitoring, payment-processing

#### 3. Super Admin (Port 3003)
**System administration dashboard**
- Security and compliance monitoring
- System performance oversight
- Integration management
- User role and permission control
- **Domains**: compliance-audit, identity-access, integration-hub, performance-monitor, user-role-management

#### 4. Operations Dashboard (Port 3004)
**Operational management interface**
- Inventory management and tracking
- Employee management and HR
- Shipping and delivery coordination
- **Domains**: inventory-management, employee-management, shipping-delivery

#### 5. Ecommerce Mobile
**Mobile-optimized customer interface**
- Responsive versions of all ecommerce-web features
- Touch-optimized interactions
- Progressive Web App capabilities

## Backend Architecture

### Microservices Ecosystem (24 Services)

#### Gateway Services (4 Services)
```
├── Central Auth Gateway (8084)     # Authentication and authorization
├── Direct Data Gateway (8081)      # Business data aggregation
├── Permission Gateway (8083)       # Role-based access control
└── Direct Image Service (8080)     # Image management and serving
```

#### Business Domain Services (23 Services)
**Core eCommerce Services (Ports 3013-3020)**
- company-management (3013) - Organizational structure
- accounting-management (3014) - Financial operations
- analytics-reporting (3015) - Business intelligence
- catalog-management (3016) - Product catalog
- compliance-audit (3017) - Regulatory compliance
- content-management (3018) - Digital content
- customer-service (3019) - Support ticketing
- employee-management (3020) - Human resources

**Operations Services (Ports 3021-3028)**
- expense-monitoring (3021) - Budget tracking
- identity-access (3022) - User authentication
- image-management (3023) - Media handling
- integration-hub (3024) - Third-party integrations
- inventory-management (3025) - Stock operations
- label-design (3026) - Product labeling
- marketplace-management (3027) - Multi-vendor support
- multi-language-management (3028) - Internationalization

**Extended Services (Ports 3029-3036)**
- notification-service (3029) - Communications
- order-management (3030) - Order processing
- payment-processing (3031) - Payment handling
- performance-monitor (3032) - System monitoring
- reporting-management (3033) - Report generation
- shipping-delivery (3034) - Logistics
- user-role-management (3035) - Access control
- subscription-management (3036) - Recurring billing
- integration-hub (3024) - Third-party integrations
- inventory-management (3025) - Stock management
- label-design (3026) - Product labeling
- marketplace-management (3027) - Multi-vendor platform
- multi-language-management (3028) - Internationalization

**Advanced Services (Ports 3029-3035)**
- notification-service (3029) - Multi-channel messaging
- order-management (3030) - Order lifecycle
- payment-processing (3031) - Payment gateway
- performance-monitor (3032) - System monitoring
- reporting-management (3033) - Report generation
- shipping-delivery (3034) - Logistics coordination
- user-role-management (3035) - RBAC system

### Service Communication Architecture

#### API Gateway Pattern
```
Client → Central Auth Gateway → Permission Gateway → Business Services
      ↓
      Direct Data Gateway → Aggregated Business Data
      ↓
      Direct Image Service → Media Assets
```

#### Service Discovery
- Microservices registry with health checks
- Load balancing and failover mechanisms
- Service mesh for inter-service communication

#### Data Flow Architecture
```
Frontend Apps → API Gateways → Business Services → Database
                    ↓
            Real-time notifications ← Notification Service
                    ↓
            Performance metrics ← Monitoring Service
```

## Database Architecture

### Database Strategy
- **Primary Database**: PostgreSQL with Drizzle ORM
- **Shared Database**: All services use single PostgreSQL instance
- **Schema Isolation**: Domain-specific tables with clear ownership
- **Connection Management**: Pool-based connections per service

### Key Database Tables
```sql
-- User Management
users, user_roles, permissions, role_permissions

-- Business Operations
companies, branches, employees, customers

-- eCommerce Core
products, categories, orders, order_items, inventory

-- Financial Management
accounts, transactions, expenses, payments

-- Content & Media
content_items, images, labels, notifications
```

## Security Architecture

### Authentication Flow
1. User login → Central Auth Gateway
2. JWT token generation with role claims
3. Permission Gateway validates requests
4. Business services receive authenticated context

### Authorization Model
- Role-Based Access Control (RBAC)
- Fine-grained permissions per endpoint
- Service-level security enforcement
- API rate limiting and throttling

### Security Features
- JWT token authentication
- HTTPS/TLS encryption
- Input validation and sanitization
- SQL injection prevention
- CORS policy enforcement

## API Architecture

### REST API Design
- RESTful endpoints with consistent patterns
- OpenAPI/Swagger documentation per service
- Standardized error handling
- Request/response validation

### API Gateway Features
- Request routing and load balancing
- Authentication and authorization
- Rate limiting and throttling
- Request/response transformation
- Logging and monitoring

### Example API Patterns
```
GET    /api/{domain}/{resource}           # List resources
GET    /api/{domain}/{resource}/{id}      # Get specific resource
POST   /api/{domain}/{resource}           # Create resource
PUT    /api/{domain}/{resource}/{id}      # Update resource
DELETE /api/{domain}/{resource}/{id}      # Delete resource
```

## Monitoring and Observability

### Health Monitoring
- Health check endpoints for all services
- Real-time status monitoring
- Automated failure detection
- Service dependency tracking

### Performance Monitoring
- Response time tracking
- Throughput monitoring
- Error rate analysis
- Resource utilization metrics

### Logging Strategy
- Centralized logging system
- Structured log format
- Log aggregation and analysis
- Error tracking and alerting

## Scalability Design

### Horizontal Scaling
- Stateless service design
- Load balancing capabilities
- Auto-scaling based on metrics
- Container orchestration ready

### Performance Optimization
- Database query optimization
- Caching strategies
- CDN integration for static assets
- Lazy loading and pagination

### Infrastructure Scaling
- Kubernetes deployment ready
- Docker containerization
- Service mesh integration
- Cloud-native architecture

## Development Workflow

### Code Organization
- Monorepo structure with shared packages
- Domain-driven design principles
- Clean architecture patterns
- TypeScript for type safety

### Build and Deployment
- Turborepo for efficient builds
- Docker containerization
- CI/CD pipeline integration
- Environment-specific configurations

### Quality Assurance
- TypeScript compilation checks
- ESLint and Prettier formatting
- Automated testing frameworks
- Code review processes

This architecture provides a robust, scalable foundation for the LeafyHealth platform with clear separation of concerns and comprehensive feature coverage.