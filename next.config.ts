import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next.js auto-converts to WebP/AVIF for supported browsers
    formats: ["image/avif", "image/webp"],
    // Optimized breakpoints for mobile-first
    deviceSizes: [390, 430, 768, 1024, 1280, 1920],
    imageSizes: [64, 128, 256, 384, 512],
    // Allow GitHub releases domain for video poster images if needed
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "objects.githubusercontent.com",
      },
      { 
        protocol: 'https', 
        hostname: 'cdn.sanity.io' 
      },
    ],
  },
  // Compress all HTTP responses
  compress: true,
  async rewrites() {
    return [
      { source: '/wp-json/:path*', destination: '/api/wp-json/:path*' },
    ];
  },
  async headers() {
    return [
      {
        source: '/wp-json/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, Content-Disposition, X-WP-Nonce, X-Requested-With, Accept' },
        ],
      },
    ];
  },
};

export default nextConfig;
