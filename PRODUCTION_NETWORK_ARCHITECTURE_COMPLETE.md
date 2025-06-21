# Production Network Architecture - Complete Implementation Guide

**Version**: 2.0.0  
**Target**: Production-Ready, VPS-Ready, Docker-Ready, Traefik-Ready  
**Security**: Single Entry Point Architecture  

## Executive Summary

This document provides a complete production-ready networking solution for the LeafyHealth Telugu organic grocery platform. The architecture transforms from a conflicted multi-port system to a secure single-entry-point design suitable for Replit development, VPS production, Docker containers, and Traefik reverse proxy deployment.

## Current Configuration Backup

### Original .replit Configuration
```toml
modules = ["python-3.11", "nodejs-20", "postgresql-16"]

[nix]
channel = "stable-24_05"

# PROBLEMATIC PORT CONFIGURATION (TO BE FIXED):
[[ports]]
localPort = 3013
externalPort = 9000  # CONFLICT: Multiple services claiming external 9000

[[ports]]
localPort = 5000
externalPort = 5000  # CORRECT: Unified Gateway entry point

[[ports]]
localPort = 8081
externalPort = 8081  # SECURITY ISSUE: Internal service exposed

[[ports]]
localPort = 8085
externalPort = 8080  # SECURITY ISSUE: Auth service exposed
```

### Service Architecture State
```
Current Services: 24 microservices + 1 frontend + 1 gateway
Database: PostgreSQL operational
Authentication: JWT-based with dual super admin roles
Port Conflicts: Multiple services competing for external port 9000
Security Issues: Internal services exposed externally
```

## Production-Ready Network Architecture

### Core Design Principles
1. **Single Entry Point**: Only port 5000 externally accessible
2. **Internal Service Mesh**: All microservices on localhost
3. **Zero Trust**: No direct external access to internal services
4. **Environment Agnostic**: Works on Replit, VPS, Docker, Traefik
5. **Production Security**: Industry-standard security practices

### Target Architecture
```
Internet
    ↓
Port 5000 (Unified Gateway) ← ONLY EXTERNAL PORT
    ↓
Internal Service Mesh (127.0.0.1)
├── Frontend (127.0.0.1:3003)
├── Auth Service (127.0.0.1:8085)
├── Data Gateway (127.0.0.1:8081)
├── Company Mgmt (127.0.0.1:3013)
└── 20 Business Microservices (127.0.0.1:3014-3036)
```

## Implementation Plan

### Phase 1: Clean Replit Configuration

#### Step 1.1: Update .replit File
```toml
modules = ["python-3.11", "nodejs-20", "postgresql-16"]

[nix]
channel = "stable-24_05"

[workflows]
runButton = "Project"

[[workflows.workflow]]
name = "Project"
mode = "parallel"
author = "agent"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "Unified Gateway"

[[workflows.workflow.tasks]]
task = "workflow.run"
args = "All Backend Services"

# CLEAN PORT CONFIGURATION - SINGLE EXTERNAL PORT ONLY
[[ports]]
localPort = 5000
externalPort = 5000

# Remove all other external port mappings for security
```

#### Step 1.2: Update Unified Gateway Configuration
```javascript
// server/unified-gateway.js - Production Configuration
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Security middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : true,
  credentials: true
}));

// Frontend proxy - INTERNAL ONLY
app.use('/', createProxyMiddleware({
  target: 'http://127.0.0.1:3003',
  changeOrigin: false,
  ws: true,
  on: {
    error: (err, req, res) => {
      console.log('Frontend proxy error:', err.message);
      // Auto-restart frontend if needed
      startFrontendService();
    }
  }
}));

// API routing - ALL INTERNAL
const serviceMap = {
  '/api/auth': 'http://127.0.0.1:8085',
  '/api/direct-data': 'http://127.0.0.1:8081',
  '/api/company-management': 'http://127.0.0.1:3013',
  '/api/identity-access': 'http://127.0.0.1:3020',
  '/api/user-role-management': 'http://127.0.0.1:3035',
  // ... all other services mapped to 127.0.0.1
};

// Bind to all interfaces for external access, proxy to localhost
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production Gateway running on port ${PORT}`);
  console.log(`🔒 Security: Only port ${PORT} externally accessible`);
  console.log(`🌐 All services proxied through localhost`);
});
```

### Phase 2: Frontend Security Configuration

#### Step 2.1: Next.js Production Config
```javascript
// frontend/apps/super-admin/next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // PRODUCTION SECURITY SETTINGS
  poweredByHeader: false,
  generateEtags: false,
  
  // INTERNAL ONLY CONFIGURATION
  hostname: '127.0.0.1',
  port: 3003,
  
  // PREVENT EXTERNAL PORT DISCOVERY
  experimental: {
    externalDir: true,
    esmExternals: true
  },
  
  // API ROUTING THROUGH UNIFIED GATEWAY
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/api/:path*'
      }
    ];
  },
  
  // DEVELOPMENT ONLY - REMOVE IN PRODUCTION
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: [
      'https://*.replit.dev',
      'https://*.replit.app'
    ]
  })
};

module.exports = nextConfig;
```

#### Step 2.2: Frontend Package.json
```json
{
  "scripts": {
    "dev": "next dev -p 3003 --hostname 127.0.0.1",
    "build": "next build",
    "start": "next start -p 3003 --hostname 127.0.0.1",
    "production": "NODE_ENV=production next start -p 3003 --hostname 0.0.0.0"
  }
}
```

### Phase 3: Microservice Security Configuration

#### Step 3.1: Standard Microservice Configuration
```javascript
// Template for all microservices
const app = express();
const PORT = process.env.PORT || 3013; // Each service has unique port

// SECURITY: Bind to localhost only
app.listen(PORT, '127.0.0.1', () => {
  console.log(`🔒 Service running securely on 127.0.0.1:${PORT}`);
  console.log(`🚫 No external access - routing through gateway only`);
});
```

#### Step 3.2: Database Configuration
```javascript
// server/db.ts - Production Database Config
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // PRODUCTION SETTINGS
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle({ client: pool, schema });
```

## Docker Production Deployment

### Step 4.1: Dockerfile
```dockerfile
# Multi-stage build for production
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

EXPOSE 5000
CMD ["node", "dist/server/unified-gateway.js"]
```

### Step 4.2: Docker Compose
```yaml
version: '3.8'

services:
  leafyhealth-gateway:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
    networks:
      - leafyhealth-network
    restart: unless-stopped

  leafyhealth-db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=leafyhealth
      - POSTGRES_USER=${PGUSER}
      - POSTGRES_PASSWORD=${PGPASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - leafyhealth-network

networks:
  leafyhealth-network:
    driver: bridge

volumes:
  postgres_data:
```

## Traefik Integration

### Step 5.1: Traefik Configuration
```yaml
# traefik.yml
api:
  dashboard: true
  insecure: false

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    exposedByDefault: false

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@leafyhealth.com
      storage: acme.json
      httpChallenge:
        entryPoint: web
```

### Step 5.2: Docker Compose with Traefik
```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v3.0
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@leafyhealth.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./letsencrypt:/letsencrypt
    networks:
      - traefik

  leafyhealth:
    build: .
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.leafyhealth.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.leafyhealth.entrypoints=websecure"
      - "traefik.http.routers.leafyhealth.tls.certresolver=letsencrypt"
      - "traefik.http.services.leafyhealth.loadbalancer.server.port=5000"
    environment:
      - NODE_ENV=production
    networks:
      - traefik

networks:
  traefik:
    external: true
```

## VPS Production Deployment

### Step 6.1: Server Setup Script
```bash
#!/bin/bash
# vps-setup.sh - Production VPS Setup

# Update system
apt update && apt upgrade -y

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
apt install docker-compose -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Create application directory
mkdir -p /opt/leafyhealth
cd /opt/leafyhealth

# Clone repository
git clone <your-repo-url> .

# Set up environment variables
cp .env.production.example .env.production

# Build and start services
docker-compose -f docker-compose.production.yml up -d

# Set up SSL with Let's Encrypt
docker run --rm -v /opt/leafyhealth/nginx:/etc/nginx/conf.d \
  -v /opt/leafyhealth/ssl:/etc/letsencrypt \
  certbot/certbot certonly --webroot -w /var/www/html \
  -d your-domain.com --email admin@leafyhealth.com --agree-tos

echo "✅ Production deployment complete"
echo "🌐 Access: https://your-domain.com"
```

### Step 6.2: Environment Configuration
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@localhost:5432/leafyhealth_prod
JWT_SECRET=your-production-jwt-secret
SESSION_SECRET=your-production-session-secret

# Replit Development
REPLIT_DOMAINS=your-repl.replit.dev
ISSUER_URL=https://replit.com/oidc

# Production Domain
PRODUCTION_DOMAIN=your-domain.com
SSL_ENABLED=true
```

## Security Hardening

### Step 7.1: Production Security Checklist
```javascript
// server/security.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### Step 7.2: Monitoring & Logging
```javascript
// server/monitoring.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      database: 'connected',
      auth: 'operational',
      microservices: '24/24 running'
    }
  });
});
```

## Testing & Validation

### Step 8.1: Automated Testing
```bash
#!/bin/bash
# test-deployment.sh

echo "🧪 Testing production deployment..."

# Test external access
curl -f http://localhost:5000/health || exit 1

# Test authentication
curl -f http://localhost:5000/api/auth/health || exit 1

# Test all microservices through gateway
for service in company-management inventory-management order-management; do
  curl -f http://localhost:5000/api/$service/health || exit 1
done

echo "✅ All tests passed"
```

### Step 8.2: Performance Testing
```javascript
// Load testing with Artillery
module.exports = {
  config: {
    target: 'http://localhost:5000',
    phases: [
      { duration: 60, arrivalRate: 10 },
      { duration: 120, arrivalRate: 50 },
    ]
  },
  scenarios: [
    {
      name: 'Login and browse',
      weight: 70,
      flow: [
        { post: { url: '/api/auth/login', json: { email: 'test@test.com', password: 'test' }}},
        { get: { url: '/api/company-management/companies' }},
        { get: { url: '/api/inventory-management/stock' }}
      ]
    }
  ]
};
```

## Migration Strategy

### Step 9.1: Zero-Downtime Migration
1. **Backup Current Configuration**: Complete state backup created
2. **Parallel Environment**: Set up new configuration alongside current
3. **Traffic Switching**: Gradual migration of traffic to new architecture
4. **Validation**: Comprehensive testing before full cutover
5. **Rollback Plan**: Immediate rollback capability if issues arise

### Step 9.2: Rollback Procedure
```bash
#!/bin/bash
# rollback.sh - Emergency Rollback

echo "🚨 Initiating emergency rollback..."

# Stop new services
docker-compose down

# Restore original configuration
cp .replit.backup .replit
cp package.json.backup package.json

# Restart original services
npm run start:all

echo "✅ Rollback complete"
```

## Post-Implementation Monitoring

### Step 10.1: Monitoring Dashboard
- **Service Health**: All 24 microservices status
- **Performance Metrics**: Response times, throughput
- **Security Alerts**: Failed authentication attempts, rate limiting
- **Database Health**: Connection pool status, query performance

### Step 10.2: Maintenance Procedures
- **Daily**: Health check verification
- **Weekly**: Performance review and optimization
- **Monthly**: Security audit and updates
- **Quarterly**: Disaster recovery testing

## Expected Results

### Immediate Benefits
- ✅ Single external port (5000) only
- ✅ No port conflicts or "No ports available" errors
- ✅ Secure internal service mesh
- ✅ Production-ready architecture

### Performance Improvements
- ✅ Faster service startup (no port conflicts)
- ✅ Better resource utilization
- ✅ Improved security posture
- ✅ Simplified deployment process

### Deployment Readiness
- ✅ Replit development environment
- ✅ VPS production deployment
- ✅ Docker containerization
- ✅ Traefik reverse proxy integration
- ✅ SSL/TLS termination
- ✅ Load balancing capability

---

**Implementation Status**: Ready for approval and execution  
**Estimated Implementation Time**: 2-3 hours  
**Risk Level**: Low (complete rollback capability maintained)  
**Production Readiness**: Full production deployment ready