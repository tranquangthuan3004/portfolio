import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/preview/thn-core/v2", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
