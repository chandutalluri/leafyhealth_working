#!/bin/bash
# Secure Service Mesh Startup Script
# Starts all microservices with proper environment configuration

echo "🔐 Starting Secure Service Mesh Architecture"

# Export database URL to all child processes
export DATABASE_URL="${DATABASE_URL}"

if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL environment variable is not set"
  exit 1
fi

echo "✅ Database URL configured"

# Function to start a service with proper environment
start_service() {
  local service_name=$1
  local service_path=$2
  
  echo "🚀 Starting $service_name..."
  cd "$service_path" || exit 1
  
  # Build the service
  npm run build
  
  # Start with environment variables
  DATABASE_URL="$DATABASE_URL" node "dist/backend/domains/$service_name/src/main.js" &
  
  # Return to original directory
  cd - > /dev/null || exit 1
}

echo "📡 Starting Business Logic Services..."
start_service "catalog-management" "backend/domains/catalog-management"
start_service "inventory-management" "backend/domains/inventory-management" 
start_service "order-management" "backend/domains/order-management"
start_service "payment-processing" "backend/domains/payment-processing"

echo "🔧 Starting Infrastructure Services..."
start_service "identity-access" "backend/domains/identity-access"
start_service "user-role-management" "backend/domains/user-role-management"

echo "📞 Starting Support Services..."
start_service "notification-service" "backend/domains/notification-service"
start_service "customer-service" "backend/domains/customer-service"

echo "⏳ Waiting for services to initialize..."
sleep 15

echo "🌐 Starting Secure API Gateway..."
cd service-mesh || exit 1
DATABASE_URL="$DATABASE_URL" node secure-gateway.js &

echo "✅ All services started with secure mesh configuration"
echo "🔒 External access restricted to API Gateway on port 8080"

# Keep script running
wait