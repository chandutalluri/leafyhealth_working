🛠️ LeafyHealth Developer Guide

This README.DEV.md defines the official development policies, system architecture, AI agent behavior, and compliance guidelines for all developers and AI agents contributing to the LeafyHealth Monorepo Application.

📋 **CRITICAL:** See `ADMIN_DASHBOARD_ARCHITECTURE.md` for current implementation details of the dual dashboard system.

📦 Monorepo Structure
frontend/
  apps/
    ecommerce-web/        # Customer-facing website
    ecommerce-mobile/     # PWA/Mobile app (PWA enabled)
    super-admin/          # Dual admin dashboard (Global + Operational)
    admin-portal/         # Branch-level admin + managers
    ops-delivery/         # Delivery & POS UI
  packages/
    ui/                   # Shared Glassmorphic UI Components
    hooks/                # Shared Zustand/React Query logic

backend/
  domains/
    auth/                 # identity-access service (JWT token issuing)
    catalog-management/   # Product/category/branch catalog
    order-management/     # Orders lifecycle, fulfillment, delivery
    customer-service/     # Support tickets, agents
    payment-processing/   # Payment gateways integration
    +18 more microservices (24 total)

server/
  unified-gateway.js      # Single unified gateway (port 5000)
  authentication-service.js # Authentication service (port 8085)
  direct-data-gateway.js  # Direct data API service (port 8081)

shared/                   # Global DTOs, types, constants, enums


⚙️ Core Tech Stack

Frontend (Next.js 15)

TailwindCSS 3.4 with glassmorphism + custom animations

Zustand (auth/cart/branch global state)

React Query (API calls, caching)

Framer Motion (entry effects)

Headless UI / DaisyUI for accessibility

PWA-ready (manifest.json, offline caching)

Backend (NestJS 10)

Drizzle ORM (PostgreSQL)

JWT authentication via Passport.js

Role-based access control (RBAC)

Multi-tenant support via branch scoping

Service-to-service orchestration planned (events/kafka)

Infrastructure

Docker per microservice (Multi-stage builds)

Docker Compose orchestration (Production-grade)

Traefik reverse proxy (SSL/HTTPS auto-management)

PostgreSQL with schema namespacing

Replit AI and Replit Workspace (dev only)

VPS self-hosted deployment target

🔐 System Rules for AI Agents & Devs

❌ NEVER DO

❌ Don’t use /pages/api/*.ts proxy endpoints (Use real backend)

❌ Don’t hardcode microservice ports like 3013, 8081, etc.

❌ Don’t delete working features, layouts, or stores without approval

❌ Don’t use mock data or temporary UI unless explicitly instructed

❌ Don’t override Zustand stores, Drizzle schemas, Tailwind config

✅ ALWAYS DO

✅ Use /api via unified gateway (http://localhost:5000 only)

✅ Respect global auth: JWT tokens via identity-access service

✅ Reuse shared components from @leafyhealth/ui

✅ Follow RBAC logic using user-role-management service

✅ Handle geolocation using /api/branches/nearby

✅ Integrate Drizzle ORM with proper table-level isolation (branch_id)

✅ Keep frontend reactive, beautiful, performant

✅ Use composite business domain architecture for operational interfaces

✅ Group microservices by business function, not technical boundaries

✅ Implement role-based access control for business domains

🏗️ COMPOSITE BUSINESS DOMAIN ARCHITECTURE

**MANDATORY IMPLEMENTATION GUIDELINES:**

**Dual Super Admin System:**
- **Global Super Admin:** Technical microservice management (current interface)
- **Operational Super Admin:** Business domain management (new composite interface)

**Business Domain Grouping:**
1. **Product Ecosystem:** catalog + inventory + images + categories + labels
2. **Order Operations:** orders + payments + shipping + customer-service
3. **Customer Management:** customers + subscriptions + notifications + user-roles
4. **Financial Control:** accounting + expenses + payment-analytics + reporting
5. **Organization Hub:** company + branches + employees + role-management
6. **Business Intelligence:** analytics + performance + custom-reporting

**Service Orchestration Pattern:**
- Frontend composite components coordinate multiple microservice calls
- Unified state management per business domain (not per microservice)
- Single user workflows spanning multiple backend services
- Error handling and rollback across service boundaries

**RBAC Implementation:**
- Permissions granted to business domains, not individual microservices
- Role hierarchy: Company Admin → Branch Admin → Ops Manager → Staff
- Branch-specific data isolation at all levels
- Dynamic permission checking: `can('products', 'edit')`

**Frontend Architecture:**
- Business domain routes: `/products`, `/orders`, `/customers`, etc.
- Tabbed interfaces within domains for related functionality
- Unified forms with multi-service data coordination
- Real-time synchronization across related microservices

⚠️ CRITICAL ENFORCEMENT

All AI agents and scripts MUST validate JWT via central service

No service should independently issue or decode tokens

All frontend apps MUST use gateway routing (no direct ports)

Microservice DB operations MUST be scoped by branch

🌐 Routing and Data Flow
Frontend (Next.js) apps
  ↳ API Requests via fetch/axios
    ↳ API Gateway (8080)
      ↳ Routes to correct microservice
        ↳ Each service has Drizzle ORM + RBAC + DB access

        
🔄 JWT Auth & Session Flow

JWT Token Issued by identity-access

Stored in Zustand (authStore)

Sent in all API requests as Authorization: Bearer <token>

Gateway forwards token to internal service

Each service uses SharedAuthModule to validate

RBAC checked against user-role-management

🛠️ Zustand Stores (Do Not Modify)

These are global and immutable unless discussed:

authStore

cartStore

branchStore

subscriptionStore

✅ Frontend Design Guidelines

Use GlassCard, GlassButton, LoadingSkeleton, GlassInput etc.

Animate with framer-motion

Responsive by default (mobile-first)

Color scheme: soft glassmorphic greens, whites, gradients

Category emojis allowed (e.g., 🥬, 🍎)

Always preload fonts, enable PWA, add SEO meta

🔒 Multi-Branch Logic

All data scoped by branch_id

Customers are assigned to branch via:

Geolocation detection (auto)

Location modal (user chooses)

Branch pricing via branch_products

Admins see only their branch, Super Admin sees all

🔁 Subscription Architecture (WIP)

Customers can subscribe to food bundles:

Daily, 3-day, 7-day, or 30-day plans

Time slots: breakfast/lunch/dinner

Subscription orders are auto-created daily

Admins manage delivery slots

Backend: subscription-service planned

Frontend UI: guided purchase + status tracking

📊 Observability & Health

Each service exposes:

/health

/api/docs

/__introspect

Frontend should show user-friendly errors

Admin panel to monitor service health (future)

🧪 Testing & Validation

Local .env.production must exist with all services configured

Run ./deploy.sh or docker-compose.demo.yml

Validate:

/ loads real data from backend

/products, /cart, /categories, /checkout functional

/auth/login and token flow works

🧩 Current Microservice Status

Service

Status

identity-access

✅ Complete

order-management

✅ Complete

catalog-management

✅ Partial

subscription-service

⚠ Planned

customer-service

✅ Complete

image-management

✅ Ready

user-role-management

✅ Partial

accounting-management

⚠ Partial

+ others

⚠ Mixed

🧠 Final Developer Philosophy

"Build like it's production, design like it's art, and deploy like it's global."

Keep user-centricity first

Prefer automation

Empower the customer

Minimize manual operations

Secure, observable, scalable

📌 Final Rule

AI agents and developers MUST NOT override or delete user instructions, working logic, or verified modules without explicit permission. All actions must be traceable, documented, and reversible.

Welcome to LeafyHealth. You are now part of a world-class, futuristic grocery-commerce platform with multi-branch intelligence. Build accordingly.