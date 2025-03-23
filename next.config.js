/** @type {import('next').NextConfig} */
const nextConfig = {
    /* config options here */
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    }
    ,typescript: {
      // This will completely ignore TypeScript errors during build
      ignoreBuildErrors: true,
    },
    eslint: {
      // This will completely ignore ESLint errors during build
      ignoreDuringBuilds: true,
    },
  };
  
  module.exports = nextConfig;