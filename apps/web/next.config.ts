import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: ["apps/web"],
  },
};

export default nextConfig;
