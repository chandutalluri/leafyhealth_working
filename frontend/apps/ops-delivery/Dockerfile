FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/apps/ops-delivery/package*.json ./frontend/apps/ops-delivery/
COPY frontend/package*.json ./frontend/

RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/apps/ops-delivery ./frontend/apps/ops-delivery
COPY shared ./shared

WORKDIR /app/frontend/apps/ops-delivery

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/frontend/apps/ops-delivery/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/ops-delivery/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/apps/ops-delivery/.next/static ./.next/static

USER nextjs

EXPOSE 3004

ENV PORT 3004
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]