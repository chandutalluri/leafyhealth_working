FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/domains/shipping-delivery/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/domains/shipping-delivery/ ./
COPY shared/ ./shared/

# Build the application
RUN npm run build

# Expose port
EXPOSE 3036

# Start the application
CMD ["npm", "run", "start:prod"]