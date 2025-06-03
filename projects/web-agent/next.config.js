/** @type {import('next').NextConfig} */
const nextConfig = {
  // This configuration is optimized for Vercel deployment
  images: {
    domains: [],
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  trailingSlash: true,
  // Disable experimental features for stability
  experimental: {
    workerThreads: false,
    craCompat: false,
  },
  env: {
    IS_STATIC_EXPORT: 'false',
    DEPLOYMENT_PLATFORM: 'vercel',
  },
  // Enable source maps for better debugging in production
  productionBrowserSourceMaps: true,
  // Enable Vercel Analytics
  analyticsId: process.env.VERCEL_ANALYTICS_ID
}

module.exports = nextConfig 