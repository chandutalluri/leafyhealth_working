/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081',
  },
  reactStrictMode: true,
  trailingSlash: false,

  allowedDevOrigins: [
    '596134ae-2368-4b16-bd88-c5ed3a677441-00-sup9fyy6rfx0.pike.replit.dev',
    '*.replit.dev',
    '*.replit.co',
    'localhost:5000',
    '127.0.0.1:5000'
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