import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["next-mdx-remote"],
  allowedDevOrigins: [],
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.siduslink.com",
        port: "",
      },
    ],
    qualities: [75, 100],
  },
  async rewrites() {
    return [
      {
        source: "/blog/:slug.mdx",
        destination: "/blog.mdx/:slug",
      },
    ];
  },
};

export default nextConfig;
