/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  },
  // All API requests are handled by Multi-App Gateway on port 5000
  // No rewrites needed as frontend is served through the gateway
  images: {
    domains: ['localhost', 'api.leafyhealth.local'],
    unoptimized: true,
  },
}

module.exports = nextConfig