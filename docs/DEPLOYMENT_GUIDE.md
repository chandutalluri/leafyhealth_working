# LeafyHealth Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying and operating the LeafyHealth platform in development, staging, and production environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Development Environment](#development-environment)
3. [Production Deployment](#production-deployment)
4. [Service Configuration](#service-configuration)
5. [Monitoring and Maintenance](#monitoring-and-maintenance)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **Node.js**: Version 20.18.1 (verified working version)
- **PostgreSQL**: Version 15+ with Neon compatibility
- **Docker**: Version 24.0+ (for containerized deployment)
- **Memory**: Minimum 8GB RAM (16GB recommended for 24 microservices)
- **Storage**: 50GB+ available disk space
- **Network**: Ports 3013-3036, 5000, 8080-8084 available
- **Package Manager**: pnpm recommended for frontend monorepo

### Development Tools
```bash
# Required package managers
npm install -g pnpm
npm install -g turbo

# Optional development tools
npm install -g @nestjs/cli
npm install -g drizzle-kit
```

### Environment Variables
Create these environment files in the project root:

**.env** (Primary configuration)
```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/leafyhealth"
PGHOST="localhost"
PGPORT="5432"
PGDATABASE="leafyhealth"
PGUSER="your_username"
PGPASSWORD="your_password"

# Service Configuration  
NODE_ENV="development"
PORT="5000"

# Microservice Ports (24 services)
COMPANY_MANAGEMENT_PORT="3013"
ACCOUNTING_MANAGEMENT_PORT="3014"
ANALYTICS_REPORTING_PORT="3015"
CATALOG_MANAGEMENT_PORT="3016"
COMPLIANCE_AUDIT_PORT="3017"
CONTENT_MANAGEMENT_PORT="3018"
CUSTOMER_SERVICE_PORT="3019"
EMPLOYEE_MANAGEMENT_PORT="3020"
EXPENSE_MONITORING_PORT="3021"
IDENTITY_ACCESS_PORT="3022"
IMAGE_MANAGEMENT_PORT="3023"
INTEGRATION_HUB_PORT="3024"
INVENTORY_MANAGEMENT_PORT="3025"
LABEL_DESIGN_PORT="3026"
MARKETPLACE_MANAGEMENT_PORT="3027"
MULTI_LANGUAGE_MANAGEMENT_PORT="3028"
NOTIFICATION_SERVICE_PORT="3029"
ORDER_MANAGEMENT_PORT="3030"
PAYMENT_PROCESSING_PORT="3031"
PERFORMANCE_MONITOR_PORT="3032"
REPORTING_MANAGEMENT_PORT="3033"
SHIPPING_DELIVERY_PORT="3034"
USER_ROLE_MANAGEMENT_PORT="3035"
SUBSCRIPTION_MANAGEMENT_PORT="3036"

# Security
JWT_SECRET="your-secure-jwt-secret-key"
SESSION_SECRET="your-secure-session-secret"

# Image Service
IMAGE_UPLOAD_PATH="/home/runner/workspace/uploads/images"
MAX_FILE_SIZE="10MB"

# Gateway Configuration
CENTRAL_AUTH_PORT="8084"
DIRECT_DATA_PORT="8081"
PERMISSION_GATEWAY_PORT="8083"
IMAGE_SERVICE_PORT="8080"
```

**.env.production** (Production overrides)
```bash
NODE_ENV="production"
DATABASE_URL="your-production-database-url"
JWT_SECRET="production-jwt-secret"
SESSION_SECRET="production-session-secret"
```

## Development Environment

### Quick Start
```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd leafyhealth-platform
pnpm install

# 2. Setup database
npm run db:setup
npm run db:push

# 3. Start all services
npm run dev:all
```

### Manual Service Startup

#### 1. Database Setup
```bash
# Create database
createdb leafyhealth

# Run migrations
npm run db:push

# Verify connection
npm run db:check
```

#### 2. Backend Services
```bash
# Start all microservices (23 services)
npm run start:microservices

# Or start individual services
cd backend/domains/company-management
npm run start:dev

# Start API gateways
npm run start:gateways
```

#### 3. Frontend Applications
```bash
# Start all frontend apps
cd frontend
npm run dev:all

# Or start individual apps
cd frontend/apps/ecommerce-web
npm run dev -- -p 5000

cd frontend/apps/admin-portal  
npm run dev -- -p 3002
```

### Service Ports Reference
```
Frontend Applications:
├── ecommerce-web:     5000
├── ecommerce-mobile:  3001  
├── admin-portal:      3002
├── super-admin:       3003
└── ops-delivery:      3004

API Gateways:
├── Central Auth:      8084
├── Direct Data:       8081
├── Permission:        8083
└── Image Service:     8080

Backend Microservices:
├── company-management:    3013
├── accounting-management: 3014
├── analytics-reporting:   3015
├── catalog-management:    3016
└── ... (continues to 3035)
```

## Production Deployment

### Docker Deployment

#### 1. Build Images
```bash
# Build all services
docker-compose build

# Build specific service
docker build -t leafyhealth/ecommerce-web ./frontend/apps/ecommerce-web
```

#### 2. Docker Compose Setup
**docker-compose.production.yml**
```yaml
version: '3.8'

services:
  database:
    image: postgres:14
    environment:
      POSTGRES_DB: leafyhealth
      POSTGRES_USER: ${PGUSER}
      POSTGRES_PASSWORD: ${PGPASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  ecommerce-web:
    build: ./frontend/apps/ecommerce-web
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - NODE_ENV=production
    depends_on:
      - database

  # Add all other services...

volumes:
  postgres_data:
```

#### 3. Production Startup
```bash
# Start production stack
docker-compose -f docker-compose.production.yml up -d

# Check service health
docker-compose ps
docker-compose logs -f
```

### Kubernetes Deployment

#### 1. Namespace Creation
```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: leafyhealth
```

#### 2. Database Deployment
```yaml
# database-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: leafyhealth
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14
        env:
        - name: POSTGRES_DB
          value: "leafyhealth"
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        ports:
        - containerPort: 5432
```

#### 3. Service Deployments
```bash
# Apply all configurations
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n leafyhealth
kubectl get services -n leafyhealth
```

### Replit Production Deployment

#### 1. Environment Configuration
```bash
# Set production environment variables
export NODE_ENV="production"
export DATABASE_URL="your-production-db-url"

# Update .replit file for production
```

#### 2. Build and Start
```bash
# Install production dependencies
pnpm install --frozen-lockfile

# Build frontend applications
cd frontend && npm run build

# Start production services
npm run start:production
```

## Service Configuration

### Database Configuration

#### Schema Initialization
```bash
# Create tables
npm run db:push

# Seed initial data
npm run db:seed

# Backup database
pg_dump leafyhealth > backup.sql

# Restore database
psql leafyhealth < backup.sql
```

#### Connection Pool Settings
```javascript
// Database connection configuration
const poolConfig = {
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  max: 20,                // Maximum pool size
  idleTimeoutMillis: 30000, // 30 seconds
  connectionTimeoutMillis: 2000, // 2 seconds
};
```

### Load Balancer Configuration

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/leafyhealth
upstream frontend_servers {
    server localhost:5000 weight=1;
    server localhost:3001 weight=1;
}

upstream api_servers {
    server localhost:8081 weight=2;
    server localhost:8083 weight=1;
    server localhost:8084 weight=1;
}

server {
    listen 80;
    server_name leafyhealth.com;

    location / {
        proxy_pass http://frontend_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://api_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### SSL/TLS Configuration
```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d leafyhealth.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoring and Maintenance

### Health Check Endpoints
All services provide health check endpoints:

```bash
# Frontend health checks
curl http://localhost:5000/api/health
curl http://localhost:3002/api/health

# Backend service health checks
curl http://localhost:3013/health  # Company Management
curl http://localhost:3014/health  # Accounting Management
# ... (all services have /health endpoints)

# Gateway health checks  
curl http://localhost:8081/health  # Direct Data Gateway
curl http://localhost:8083/health  # Permission Gateway
curl http://localhost:8084/health  # Central Auth Gateway
curl http://localhost:8080/health  # Image Service
```

### Performance Monitoring

#### Service Monitoring Script
```bash
#!/bin/bash
# monitor-services.sh

echo "=== LeafyHealth Service Health Check ==="
echo "Date: $(date)"
echo

# Check frontend services
echo "Frontend Services:"
for port in 5000 3001 3002 3003 3004; do
  if curl -s http://localhost:$port/api/health > /dev/null; then
    echo "  ✅ Port $port - Healthy"
  else
    echo "  ❌ Port $port - Unhealthy"
  fi
done

# Check backend services
echo -e "\nBackend Services:"
for port in {3013..3035}; do
  if curl -s http://localhost:$port/health > /dev/null; then
    echo "  ✅ Port $port - Healthy"
  else
    echo "  ❌ Port $port - Unhealthy"
  fi
done

# Check gateway services
echo -e "\nGateway Services:"
for port in 8080 8081 8083 8084; do
  if curl -s http://localhost:$port/health > /dev/null; then
    echo "  ✅ Port $port - Healthy"
  else
    echo "  ❌ Port $port - Unhealthy"
  fi
done
```

#### Automated Monitoring Setup
```bash
# Create monitoring cron job
echo "*/5 * * * * /path/to/monitor-services.sh >> /var/log/leafyhealth-health.log" | crontab -

# Log rotation setup
sudo nano /etc/logrotate.d/leafyhealth
```

### Database Maintenance

#### Backup Strategy
```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/leafyhealth"
BACKUP_FILE="$BACKUP_DIR/leafyhealth_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U $PGUSER leafyhealth > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Keep only last 30 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

#### Performance Optimization
```sql
-- Database maintenance queries
VACUUM ANALYZE;
REINDEX DATABASE leafyhealth;

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Database size monitoring
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Service Startup Failures
```bash
# Check service logs
docker logs <container_name>
npm run logs:service-name

# Common fixes
# - Check port availability
netstat -tulpn | grep :3013

# - Verify environment variables
printenv | grep DATABASE_URL

# - Check database connection
npm run db:check
```

#### 2. Frontend Build Issues
```bash
# Clear build cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules
pnpm install

# Check TypeScript errors
npm run type-check
```

#### 3. Database Connection Issues
```bash
# Test database connection
psql -h localhost -U $PGUSER -d leafyhealth -c "SELECT version();"

# Check database service
sudo systemctl status postgresql

# Restart database service
sudo systemctl restart postgresql
```

#### 4. Memory Issues
```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# Optimize Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"

# Restart services with memory optimization
npm run start:optimized
```

#### 5. API Gateway Issues
```bash
# Check gateway connectivity
curl -v http://localhost:8081/health

# Verify routing configuration
cat server/direct-data-gateway.js | grep -A 5 "routes"

# Restart gateway services
npm run restart:gateways
```

### Emergency Procedures

#### Service Recovery
```bash
# Quick service restart
npm run restart:all

# Selective service restart  
npm run restart:backend
npm run restart:frontend

# Database recovery
npm run db:restore backup.sql
```

#### Rollback Procedure
```bash
# Application rollback
git checkout previous-stable-tag
npm run deploy:rollback

# Database rollback
npm run db:rollback-migration
```

### Performance Optimization

#### Frontend Optimization
```bash
# Bundle analysis
npm run build:analyze

# Image optimization
npm run optimize:images

# Cache optimization
npm run clear:cache
```

#### Backend Optimization
```bash
# Database query optimization
npm run db:analyze-queries

# Service performance profiling
npm run profile:services

# Memory leak detection
npm run detect:memory-leaks
```

### Logging and Debugging

#### Log Locations
```bash
# Application logs
tail -f logs/application.log

# Service-specific logs
tail -f logs/ecommerce-web.log
tail -f logs/company-management.log

# System logs
sudo journalctl -f -u leafyhealth
```

#### Debug Mode Activation
```bash
# Enable debug logging
export DEBUG="leafyhealth:*"
export LOG_LEVEL="debug"

# Start services in debug mode
npm run dev:debug
```

This deployment guide provides comprehensive coverage for setting up, deploying, and maintaining the LeafyHealth platform across different environments. Follow the appropriate sections based on your deployment needs and environment requirements.