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
      {
        protocol: 'https',
        hostname: 'wzrwjscoaajoahrhtjjw.supabase.co'
      }
    ],
  },
  // Compress all HTTP responses
  compress: true,
  async rewrites() {
    return [
      { source: '/wp-json/:path*', destination: '/api/wp-json/:path*' },
    ];
  },
  async redirects() {
    return [
      // 旧乱数字 slug → 语义化 slug（2026-07 内容清理）
      { source: '/blog/post-187185255', destination: '/blog/cheap-pickleball-buckets-hidden-cost-per-bucket', permanent: true },
      { source: '/blog/post-725334274', destination: '/blog/oem-vs-private-label-pickleball-paddles', permanent: true },
      { source: '/blog/post-82343419', destination: '/blog/pickleball-paddle-wholesale-sourcing-retailer-guide', permanent: true },
      // 已删除的重复文章 → 保留的原版（301 承接可能已有的收录）
      { source: '/blog/delaminated-pickleball-paddle-repair1', destination: '/blog/delaminated-pickleball-paddle-repair', permanent: true },
      { source: '/blog/pickleball-grip-size-guide1', destination: '/blog/pickleball-grip-size-guide', permanent: true },
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
