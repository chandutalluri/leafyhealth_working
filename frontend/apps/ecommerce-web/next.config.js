/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  reactStrictMode: true,
  trailingSlash: false,

  allowedDevOrigins: [
    'https://61915ea0-a177-4649-b04c-5bf5513c2ae7-00-25z6jk7p0vm4h.riker.replit.dev'
  ],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data: http: https:; font-src 'self' data:; connect-src 'self' http://localhost:* ws://localhost:*;",
          },
        ],
      },
    ];
  },
  // All API requests are handled by Multi-App Gateway on port 5000
  // No rewrites needed as frontend is served through the gateway
  async redirects() {
    return [];
  },
};

module.exports = nextConfig;