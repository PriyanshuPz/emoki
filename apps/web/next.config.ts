import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  rewrites: async () => {
    const server = process.env.NEXT_PUBLIC_SERVER_URL;
    return {
      beforeFiles: [
        {
          source: "/trpc/:path*",
          destination: `${server}/trpc/:path*`,
        },
        {
          source: "/api/auth/:path*",
          destination: `${server}/api/auth/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
