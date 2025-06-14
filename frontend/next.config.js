/** @type {import('next').NextConfig} */

const nextConfig = {
  // Core optimizations for fast development
  reactStrictMode: true,
  
  // Simplified experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@heroicons/react'],
  },
  
  // Simple image optimization
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
  },

  // Basic compiler settings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Simple build settings
  poweredByHeader: false,
  
  // API rewrites
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/:path*',
      },
    ];
  },
};

module.exports = nextConfig
