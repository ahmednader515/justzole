import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Includes Googlebot, Bingbot, and AI search crawlers such as OAI-SearchBot.
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/account", "/api/", "/go/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
