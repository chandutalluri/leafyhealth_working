/**
 * Shared Next.js configuration for all frontend applications
 * Ensures proper routing and API integration with centralized gateway
 */

/** @type {import('next').NextConfig} */
const baseConfig = {
  swcMinify: true,
  poweredByHeader: false,
  
  experimental: {
    externalDir: true,
    optimizeCss: true,
    optimizeServerReact: true
  },
  
  images: {
    domains: ['localhost'],
    unoptimized: process.env.NODE_ENV === 'development'
  },
  
  env: {
    GATEWAY_URL: process.env.GATEWAY_URL || '',
    API_BASE_URL: '/api'
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  output: 'standalone',
  compress: true,
  
  ...(process.env.NODE_ENV === 'development' && {
    reactStrictMode: false,
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),
  
  ...(process.env.NODE_ENV === 'production' && {
    reactStrictMode: true,
    optimizeFonts: true,
  })
};

module.exports = baseConfig;