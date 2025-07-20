import type {NextConfig} from 'next';

const isDevelopment = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  // GitHub Pages configuration (only for production builds)
  ...(isDevelopment ? {} : {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  }),
  
  // Basic configuration
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Compression and minification
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
