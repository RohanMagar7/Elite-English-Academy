import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cbapuswsyxcjoeavphtq.supabase.co",
      },
    ],
    dangerouslyAllowLocalIP: true,
  },
};

export default nextConfig;
