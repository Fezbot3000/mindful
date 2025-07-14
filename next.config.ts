import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  // GitHub Pages configuration
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  
  // Base path for GitHub Pages (will be set via environment variable)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
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
