import { PUBLISHED } from "@/i18n/locales";
import { SITE } from "@/lib/seo";

// The sitemap index at the address search engines already know: one sitemap a
// published language (app/sitemaps/sitemap.ts), each under the 50 thousand URLs a
// file may hold.
export function GET(): Response {
  const files = PUBLISHED.map((locale) => `  <sitemap><loc>${SITE}/sitemaps/sitemap/${locale.code}.xml</loc></sitemap>`).join("\n");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${files}\n</sitemapindex>\n`, {
    headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" },
  });
}
