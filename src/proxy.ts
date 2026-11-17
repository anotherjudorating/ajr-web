import { NextResponse, type NextRequest } from "next/server";

import { client, overloaded } from "@/lib/data-client";
import { takePage } from "@/lib/page-limit";
import { SITE } from "@/lib/seo";

// While the database cannot keep up (the data client's breaker open, or its queue half
// full), crawlers are told to come back later (503 + Retry-After: search engines slow
// down and keep the page) instead of joining the queue or getting a page that hangs.
// People are let through: their page often comes from the cache, and they come first.
const CRAWLER =
  /bot\b|bot\/|crawl|spider|slurp|bingpreview|yandex|baidu|duckduck|facebookexternalhit|gptbot|claudebot|ccbot|bytespider|meta-externalagent|amazonbot|applebot|perplexity|petalbot|semrush|ahrefs|mj12/i;

// Render's own address (ajr-web.onrender.com) reaches the site without Cloudflare,
// and so without its challenge (ajr-web/infra, waf_custom): sent to the site's address.
const ORIGIN_HOST = /\.onrender\.com$/;

export function proxy(request: NextRequest) {
  if (ORIGIN_HOST.test(request.headers.get("host") ?? "")) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`${SITE}${pathname}${search}`, 308);
  }
  const crawler = CRAWLER.test(request.headers.get("user-agent") ?? "");
  // A page's HTML as a browser asks for it (Accept: text/html; not Next's navigation and
  // prefetch requests, whose RSC header and ?_rsc= Next removes before this runs), per
  // visitor's IP as Cloudflare gives it; search engines are left to their own pace.
  const ip = request.headers.get("cf-connecting-ip");
  if (
    ip &&
    !crawler &&
    request.method === "GET" &&
    (request.headers.get("accept") ?? "").includes("text/html") &&
    !request.nextUrl.pathname.startsWith("/api/")
  ) {
    const page = takePage(ip);
    if (!page.ok) {
      return new NextResponse(
        "Too many pages at once, please slow down. The whole data set is at /data.",
        {
          status: 429,
          headers: {
            "retry-after": String(page.retryAfter),
            "cache-control": "no-store",
          },
        },
      );
    }
  }
  if (overloaded() && crawler) {
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
  matcher: [
    "/((?!_next/|api/health|icon.svg|favicon.ico|robots.txt|sitemap.xml|llms.txt).*)",
  ],
};
