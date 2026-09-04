import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (best compression for detailed outdoor photos), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Source photos top out around 1600px, so skip the huge 2048/3840 variants.
    deviceSizes: [360, 420, 640, 828, 1080, 1200, 1600, 1920],
    imageSizes: [128, 256, 384],
    qualities: [75, 90],
    minimumCacheTTL: 2592000, // 30 days
  },
};

export default nextConfig;
