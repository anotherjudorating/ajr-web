import { NextResponse, type NextRequest } from "next/server";

import { client, overloaded } from "@/lib/data-client";

// While the database cannot keep up (the data client's breaker open, or its queue half
// full), crawlers are told to come back later (503 + Retry-After: search engines slow
// down and keep the page) instead of joining the queue or getting a page that hangs.
// People are let through: their page often comes from the cache, and they come first.
const CRAWLER =
  /bot\b|bot\/|crawl|spider|slurp|bingpreview|yandex|baidu|duckduck|facebookexternalhit|gptbot|claudebot|ccbot|bytespider|meta-externalagent|amazonbot|applebot|perplexity|petalbot|semrush|ahrefs|mj12/i;

export function proxy(request: NextRequest) {
  if (overloaded() && CRAWLER.test(request.headers.get("user-agent") ?? "")) {
    client.counts.shed++;
    return new NextResponse("The site is busy, please come back later.", {
      status: 503,
      headers: { "retry-after": "120", "cache-control": "no-store" },
    });
  }
  return NextResponse.next();
}

export const config = {
  // pages only: not the site's assets, not the health check
  matcher: ["/((?!_next/|api/health|icon.svg|favicon.ico|robots.txt|sitemap.xml|llms.txt).*)"],
};
