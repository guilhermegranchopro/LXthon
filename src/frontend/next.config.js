/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  // Core optimizations
  reactStrictMode: true,
  
  // Turbopack configuration (stable in Next.js 15)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Updated experimental features for Next.js 15
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', '@heroicons/react'],
    esmExternals: true,
  },

  // External packages moved to root level
  serverExternalPackages: ['sharp', 'canvas'],
  
  // Enhanced image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Optimized compiler settings
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false,
  },
  
  // Build optimizations
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  
  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Enable webpack caching for faster builds
    if (!dev) {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }
    
    // Optimize bundle splitting
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          motion: {
            test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
            name: 'framer-motion',
            chunks: 'all',
          },
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react|@heroicons)[\\/]/,
            name: 'icons',
            chunks: 'all',
          },
        },
      },
    };
    
    // Tree shaking optimizations
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;
    
    return config;
  },
  
  // Headers for caching and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },
  
  // API rewrites with caching
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8001/:path*',
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig)
