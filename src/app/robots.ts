import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const url = process.env.APP_URL || "https://tonysantana.dev";

  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: `${url}/sitemap.xml`,
  };
}
