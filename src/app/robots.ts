import type { MetadataRoute } from "next";

import { SITE } from "@/lib/seo";

// What crawlers may fetch. Every page a crawler opens for the first time after a
// data change costs a render and database calls, so the endless or low-value URLs
// are closed: single contests (230 thousand), past days' tables, filtered lists, the
// site's own API (a head-to-head pair is open: the pages of pairs that have met are
// indexed). Search and answer bots (Googlebot, Bingbot, OAI-SearchBot,
// Claude-SearchBot, PerplexityBot) follow the first group; bots that only collect
// training data get the cached core of the site (two of them, among the heaviest on
// 2026-11-10, slowly); the SEO tools' link crawlers (half of the site's traffic then,
// no visitors) a page every 10 s. Amazon's search bot and the answer bots are left be.
export default function robots(): MetadataRoute.Robots {
  const closed = ["/api/", "/contests/", "/rankings/*/20", "/explore/*?"];
  const core = [...closed, "/athletes/", "/tournaments/", "/explore/", "/head-to-head"]; // training bots: the core only
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: closed },
      {
        userAgent: ["AhrefsBot", "SemrushBot", "SERankingBacklinksBot"],
        allow: "/",
        disallow: [...closed, "/head-to-head?"],
        crawlDelay: 10,
      },
      {
        userAgent: ["GPTBot", "ClaudeBot", "CCBot", "Bytespider", "meta-externalagent", "Amazonbot", "Applebot-Extended"],
        allow: "/",
        disallow: [...core],
      },
      {
        userAgent: ["ElevenlabsCrawler", "Reflectionbot"],
        allow: "/",
        disallow: [...core],
        crawlDelay: 10,
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
