/** @type {import('next').NextConfig} */
const nextConfig = {
  // PRODUCTION SECURITY SETTINGS
  poweredByHeader: false,
  generateEtags: false,
  
  experimental: {
    externalDir: true,
    esmExternals: true
  },
  
  // PREVENT EXTERNAL PORT DISCOVERY
  output: 'standalone',
  
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
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
  
  images: {
    domains: ['localhost', '127.0.0.1', 'api.leafyhealth.local'],
    unoptimized: true,
  },
  
  // REPLIT ENVIRONMENT CONFIGURATION
  allowedDevOrigins: [
    'https://61915ea0-a177-4649-b04c-5bf5513c2ae7-00-25z6jk7p0vm4h.riker.replit.dev'
  ],
  
  // CORS HEADERS FOR UNIFIED GATEWAY
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig