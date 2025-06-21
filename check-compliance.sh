#!/bin/bash

echo "🔍 Checking LeafyHealth Architecture Compliance..."

# Check for forbidden pages/api proxies
echo "1. Checking for Next.js proxy endpoints..."
violation=$(find frontend/apps -path "*/pages/api/*.ts" 2>/dev/null)
if [[ -n "$violation" ]]; then
  echo "❌ Proxy API files detected:"
  echo "$violation"
  exit 1
else
  echo "✅ No pages/api violations found"
fi

# Check for direct microservice port usage
echo "2. Checking for direct microservice port usage..."
direct_ports=$(grep -r "localhost:30[0-9][0-9]\|localhost:80[0-9][0-9]" frontend/apps --include="*.ts" --include="*.tsx" --exclude-dir=node_modules 2>/dev/null | grep -v "8080")
if [[ -n "$direct_ports" ]]; then
  echo "❌ Direct microservice port usage detected:"
  echo "$direct_ports"
  exit 1
else
  echo "✅ No direct port violations found"
fi

# Check environment variables
echo "3. Checking environment configuration..."
for app in frontend/apps/*/; do
  if [[ ! -f "$app/.env.local" ]]; then
    echo "❌ Missing .env.local in $app"
    exit 1
  fi
  
  if ! grep -q "NEXT_PUBLIC_API_GATEWAY=http://localhost:8080" "$app/.env.local"; then
    echo "❌ Incorrect API_GATEWAY configuration in $app/.env.local"
    exit 1
  fi
done
echo "✅ Environment configuration correct"

# Check centralized gateway status
echo "4. Checking centralized gateway status..."
if ! curl -s http://localhost:8080/health > /dev/null; then
  echo "❌ Centralized gateway not responding at port 8080"
  exit 1
else
  echo "✅ Centralized gateway operational"
fi

# Check service registry
echo "5. Checking service registry..."
services=$(curl -s http://localhost:8080/registry | python3 -c "import sys,json; data=json.load(sys.stdin); print(len(data['services']))" 2>/dev/null)
if [[ "$services" != "25" ]]; then
  echo "❌ Expected 25 services, found $services"
  exit 1
else
  echo "✅ All 25 microservices registered"
fi

echo ""
echo "🎯 Architecture Compliance: PASSED"
echo "✅ True microservices architecture enforced"
echo "✅ Centralized gateway routing active"
echo "✅ No frontend bypasses detected"