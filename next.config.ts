import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*'],

  experimental: {
    viewTransition: true,
  },

  images: {
    // Cache optimized images for 30 days instead of 60 seconds (default).
    // This is the primary lever to reduce Vercel Image Optimization Cache Writes.
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Only generate the sizes your UI actually uses — fewer variants = fewer cache writes.
    deviceSizes: [640, 828, 1080, 1280, 1920],
    imageSizes: [16, 32, 64, 128, 256],
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev.kacc.mn',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
