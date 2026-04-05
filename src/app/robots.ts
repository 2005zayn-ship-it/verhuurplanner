import { MetadataRoute } from "next";

const BLOCKED_PATHS = ["/admin", "/dashboard", "/login", "/api", "/opengraph-image"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "GPTBot", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "ChatGPT-User", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "ClaudeBot", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "Claude-SearchBot", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "Claude-User", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "Google-Extended", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "PerplexityBot", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "Applebot-Extended", allow: "/", disallow: BLOCKED_PATHS },
      { userAgent: "meta-externalagent", allow: "/", disallow: BLOCKED_PATHS },
    ],
    sitemap: "https://www.verhuurplanner.be/sitemap.xml",
  };
}
