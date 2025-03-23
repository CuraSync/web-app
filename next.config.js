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
    // This setting will suppress runtime warnings related to hydration
  reactStrictMode: false,
  // This can help with certain CSR warnings
  experimental: {
    // This disables the Server Components warnings
    serverComponentsExternalPackages: [],
    // This can help with certain SSR warnings
    optimizeCss: false,
  }
  };
  
  module.exports = nextConfig;