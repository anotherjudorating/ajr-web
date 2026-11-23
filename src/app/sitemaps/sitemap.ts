import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { DEFAULT_LANG, localePath, PUBLISHED } from "@/i18n/locales";
import { lastUpdate, sitemapData } from "@/lib/api";
import { indexableAthlete, SITE } from "@/lib/seo";
import { WEIGHTS } from "@/lib/weights";

// The pages worth indexing, with the day their content last changed (from the data,
// so a revalidation that changed nothing writes the same file): the rankings, the
// athletes with enough to show (lib/seo.ts), every tournament with rated contests,
// every nation, the records and the lists. One file a published language (about 17
// thousand URLs each, the limit is 50 thousand), at /sitemaps/sitemap/<lang>.xml, each
// page with the same page in the other languages as its alternates (hreflang);
// /sitemap.xml lists the files (app/sitemap.xml/route.ts).
export async function generateSitemaps() {
  return PUBLISHED.map((locale) => ({ id: locale.code }));
}

export default async function sitemap({ id }: { id: Promise<string> }): Promise<MetadataRoute.Sitemap> {
  const asked = await id;
  const lang = PUBLISHED.find((locale) => locale.code === asked)?.code ?? DEFAULT_LANG;
  // built on its first request, not with the site (one more heavy read while the
  // build renders every page at once); its data is cached until it changes
  await connection();
  const [data, updated] = await Promise.all([sitemapData(), lastUpdate()]);
  const today = (updated ?? "1970-01-01").slice(0, 10);
  // no date for the few pages of the 1960s judobase has: search engines reject
  // dates that old, and they say nothing about a page anyway
  const address = (lang: (typeof PUBLISHED)[number]["code"], path: string) => `${SITE}${localePath(lang, path)}`;
  const page = (path: string, lastModified?: string | null) =>
    [lang].map((code) => ({
      url: address(code, path),
      ...(lastModified && lastModified >= "2000-01-01" ? { lastModified } : {}),
      ...(PUBLISHED.length > 1
        ? {
            alternates: {
              languages: {
                ...Object.fromEntries(PUBLISHED.map((l) => [l.htmlLang, address(l.code, path)])),
                "x-default": address(DEFAULT_LANG, path),
              },
            },
          }
        : {}),
    }));
  return [
    ...page("/", today),
    ...WEIGHTS.flatMap((w) => page(`/rankings/${w.slug}`, today)),
    ...page("/rankings/p4p/men", today),
    ...page("/rankings/p4p/women", today),
    ...["mixed", "men", "women"].flatMap((kind) => page(`/rankings/teams/${kind}`, today)),
    ...page("/records", today),
    ...page("/data", today),
    ...page("/methodology"),
    ...page("/contact"),
    ...page("/head-to-head"),
    ...["athletes", "contests", "tournaments", "nations"].flatMap((list) => page(`/explore/${list}`, today)),
    ...data.nations.flatMap((ioc) => page(`/countries/${ioc.toLowerCase()}`, today)),
    ...data.tournaments.flatMap(([id, lastDay]) => page(`/tournaments/${id}`, lastDay)),
    ...data.athletes
      .filter(([, lastContest, contests]) => indexableAthlete(contests, lastContest, today))
      .flatMap(([id, lastContest]) => page(`/athletes/${id}`, lastContest)),
  ];
}
