import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dev.kacc.mn',
        port: '',
        pathname: '/media/**',
      },
    ],
  },
};

export default nextConfig;
