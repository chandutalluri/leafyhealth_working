FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/apps/super-admin/package*.json ./frontend/apps/super-admin/
COPY frontend/package*.json ./frontend/

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/apps/super-admin ./frontend/apps/super-admin
COPY shared ./shared

WORKDIR /app/frontend/apps/super-admin

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/apps/super-admin/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/super-admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/super-admin/.next/static ./.next/static

USER nextjs

EXPOSE 3003

ENV PORT 3003
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]