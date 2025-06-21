FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/domains/content-management/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/domains/content-management/ ./
COPY shared/ ./shared/

# Build the application
RUN npm run build

# Expose port
EXPOSE 3018

# Start the application
CMD ["npm", "run", "start:prod"]