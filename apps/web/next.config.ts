import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  rewrites: async () => {
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";
    return [
      {
        source: "/api/auth/:path*",
        destination: `${serverUrl}/api/auth/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
