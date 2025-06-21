# Multi-stage production build for LeafyHealth platform
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY frontend/apps/super-admin/package*.json ./frontend/apps/super-admin/
COPY backend/domains/company-management/package*.json ./backend/domains/company-management/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build frontend application
WORKDIR /app/frontend/apps/super-admin
RUN npm run build

# Build backend services
WORKDIR /app/backend/domains/company-management
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install security updates
RUN apk update && apk upgrade && apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S leafyhealth -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=leafyhealth:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=leafyhealth:nodejs /app/server ./server
COPY --from=builder --chown=leafyhealth:nodejs /app/shared ./shared
COPY --from=builder --chown=leafyhealth:nodejs /app/frontend/apps/super-admin/.next ./frontend/apps/super-admin/.next
COPY --from=builder --chown=leafyhealth:nodejs /app/backend/domains/company-management/dist ./backend/domains/company-management/dist
COPY --from=builder --chown=leafyhealth:nodejs /app/package.json ./

# Set production environment
ENV NODE_ENV=production
ENV PORT=5000
ENV HOSTNAME=0.0.0.0

# Expose only the unified gateway port
EXPOSE 5000

# Use non-root user
USER leafyhealth

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start application with dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/unified-gateway.js"]