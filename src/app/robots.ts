import type { MetadataRoute } from "next";

import { SITE } from "@/lib/seo";

// What crawlers may fetch. Every page a crawler opens for the first time after a
// data change costs a render and database calls, so the endless or low-value URLs
// are closed: single contests (230 thousand), past days' tables, filtered lists,
// head-to-head pairs, the site's own API. Search and answer bots (Googlebot, Bingbot,
// OAI-SearchBot, Claude-SearchBot, PerplexityBot) follow the first group; bots that
// only collect training data get the cached core of the site.
export default function robots(): MetadataRoute.Robots {
  const closed = ["/api/", "/contests/", "/rankings/*/20", "/explore/*?", "/head-to-head?"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: closed },
      {
        userAgent: ["GPTBot", "ClaudeBot", "CCBot", "Bytespider", "meta-externalagent", "Amazonbot", "Applebot-Extended"],
        allow: "/",
        disallow: [...closed, "/athletes/", "/tournaments/", "/explore/", "/head-to-head"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
