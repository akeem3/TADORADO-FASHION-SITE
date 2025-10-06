import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Bypass Next.js image optimizer so remote Firebase images load directly in prod
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
    ],
  },
  // Ensure proper hostname binding for Render
  serverExternalPackages: ["@prisma/client"],
};

export default nextConfig;
