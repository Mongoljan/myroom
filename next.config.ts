import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*'],

  turbopack: {
    root: process.cwd(),
  },

  experimental: {
    viewTransition: true,
  },

  images: {
    // Cache optimized images for 31 days (Vercel recommended minimum).
    minimumCacheTTL: 2678400, // 31 days
    // Allowlist only the quality values actually used — fewer variants = fewer cache writes.
    qualities: [75, 85],
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
