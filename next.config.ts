import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
  },
  // Production optimizations
  output: "standalone",
  // Ensure proper hostname binding for Render
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
