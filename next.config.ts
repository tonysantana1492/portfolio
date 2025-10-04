import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  reactStrictMode: true,
  transpilePackages: ["next-mdx-remote"],
  allowedDevOrigins: [],
  devIndicators: false,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
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
        source: "/s/:subdomain/blog/:slug.mdx",
        destination: "/s/:subdomain/blog.mdx/:slug",
      },
      {
        source: "/s/:subdomain/cv/:slug.mdx",
        destination: "/s/:subdomain/cv.mdx/:slug",
      },
    ];
  },
};

export default nextConfig;
