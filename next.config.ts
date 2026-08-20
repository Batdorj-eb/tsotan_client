import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "https", hostname: "rest.tsotan.mn" },
      { protocol: "http", hostname: "rest.tsotan.mn" },
      { protocol: "https", hostname: "**.tsotan.mn" },
    ],
  },
};

export default nextConfig;
