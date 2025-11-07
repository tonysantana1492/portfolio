import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // External packages for serverless functions in Next.js 16
  serverExternalPackages: [
    "@sparticuz/chromium",
    "puppeteer-core",
    "puppeteer",
  ],

  // Experimental features for Next.js 16
  experimental: {
    // Better bundle optimization
    optimizePackageImports: ["lucide-react"],
  },

  reactStrictMode: true,
  reactCompiler: true,
  cacheComponents: true,
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
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/manifest.webmanifest",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: "/blog/:slug.mdx",
        destination: "/blog.mdx/:slug",
      },
      {
        source: "/resume/:slug.mdx",
        destination: "/resume.mdx/:slug",
      },
    ];
  },
};

export default nextConfig;
