/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },
  allowedDevOrigins: [
    'https://61915ea0-a177-4649-b04c-5bf5513c2ae7-00-25z6jk7p0vm4h.riker.replit.dev'
  ],
  images: {
    domains: ['localhost', 'api.leafyhealth.local'],
    unoptimized: true,
  },
}

module.exports = nextConfig