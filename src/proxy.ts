import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_LANG, isLang } from "@/i18n/locales";
import { client, overloaded } from "@/lib/data-client";
import { noteLanguage } from "@/lib/languages";
import { noteRequest, takePage } from "@/lib/page-limit";
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

// The pages live under app/[lang]/ (src/i18n/locales.ts). English has no prefix in
// its addresses: "/rankings/men-73" is rewritten to "/en/rankings/men-73" inside, the
// address in the browser stays. "/en/..." from outside is sent to the address without
// it (one address a page). An unknown first segment ("/xx/foo") is rewritten like any
// English path and gets the English 404. Not rewritten: the API, Next's own paths.
function language(pathname: string): { rewrite?: string; redirect?: string } {
  if (pathname.startsWith("/api/") || pathname.startsWith("/_")) return {};
  const match = pathname.match(/^\/([a-z]{2})(?=\/|$)(.*)$/);
  const first = match?.[1];
  if (first === DEFAULT_LANG) return { redirect: match?.[2] || "/" };
  if (first && isLang(first)) return {};
  return { rewrite: `/${DEFAULT_LANG}${pathname}` };
}

export function proxy(request: NextRequest) {
  if (ORIGIN_HOST.test(request.headers.get("host") ?? "")) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`${SITE}${pathname}${search}`, 308);
  }
  // Nothing here reads Accept-Language or the language cookie: a page's HTML is cached
  // at the edge for hours for everyone, so the language can only be chosen in the
  // browser (src/components/LanguageRedirect.tsx).
  const { rewrite, redirect } = language(request.nextUrl.pathname);
  if (redirect) {
    const url = request.nextUrl.clone();
    url.pathname = redirect;
    return NextResponse.redirect(url, 308);
  }
  const crawler = CRAWLER.test(request.headers.get("user-agent") ?? "");
  // A page's HTML as a browser asks for it (Accept: text/html; not Next's navigation and
  // prefetch requests, whose RSC header and ?_rsc= Next removes before this runs), per
  // visitor's IP as Cloudflare gives it; search engines are left to their own pace.
  const headers = request.headers;
  const ip = headers.get("cf-connecting-ip") ?? headers.get("true-client-ip");
  const html = (headers.get("accept") ?? "").includes("text/html");
  const page =
    request.method === "GET" && !request.nextUrl.pathname.startsWith("/api/");
  if (page) {
    noteRequest(
      [
        crawler ? "crawler" : "visitor",
        html ? "html" : "other",
        ...["cf-connecting-ip", "true-client-ip", "x-real-ip"].filter((name) =>
          headers.has(name),
        ),
        `xff${(headers.get("x-forwarded-for") ?? "").split(",").filter(Boolean).length}`,
      ].join(" "),
    );
  }
  if (page && !crawler) noteLanguage(headers.get("accept-language"), ip);
  if (ip && page && html && !crawler) {
    const taken = takePage(ip);
    if (!taken.ok) {
      return new NextResponse(
        "Too many pages at once, please slow down. The whole data set is at /data.",
        {
          status: 429,
          headers: {
            "retry-after": String(taken.retryAfter),
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
  if (rewrite) {
    const url = request.nextUrl.clone();
    url.pathname = rewrite;
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  // pages only: not the site's assets, not the health check
  matcher: [
    "/((?!_next/|api/health|icon.svg|favicon.ico|robots.txt|sitemap.xml|sitemaps/|llms.txt).*)",
  ],
};
