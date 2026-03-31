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
    ],
  },
  // Compress all HTTP responses
  compress: true,
};

export default nextConfig;
