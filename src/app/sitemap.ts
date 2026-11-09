import type { MetadataRoute } from "next";
import { connection } from "next/server";

import { lastUpdate, sitemapData } from "@/lib/api";
import { indexableAthlete, SITE } from "@/lib/seo";
import { WEIGHTS } from "@/lib/weights";

// The pages worth indexing, with the day their content last changed (from the data,
// so a revalidation that changed nothing writes the same file): the rankings, the
// athletes with enough to show (lib/seo.ts), every tournament with rated contests,
// every nation, the records and the lists. About 25 thousand URLs: one file (the
// limit is 50 thousand).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // built on its first request, not with the site (one more heavy read while the
  // build renders every page at once); its data is cached until it changes
  await connection();
  const [data, updated] = await Promise.all([sitemapData(), lastUpdate()]);
  const today = (updated ?? "1970-01-01").slice(0, 10);
  // no date for the few pages of the 1960s judobase has: search engines reject
  // dates that old, and they say nothing about a page anyway
  const page = (path: string, lastModified?: string | null) => ({
    url: `${SITE}${path}`,
    ...(lastModified && lastModified >= "2000-01-01" ? { lastModified } : {}),
  });
  return [
    page("/", today),
    ...WEIGHTS.map((w) => page(`/rankings/${w.slug}`, today)),
    page("/rankings/p4p/men", today),
    page("/rankings/p4p/women", today),
    ...["mixed", "men", "women"].map((kind) => page(`/rankings/teams/${kind}`, today)),
    page("/records", today),
    page("/data", today),
    page("/head-to-head"),
    ...["athletes", "contests", "tournaments", "nations"].map((list) => page(`/explore/${list}`, today)),
    ...data.nations.map((ioc) => page(`/countries/${ioc.toLowerCase()}`, today)),
    ...data.tournaments.map(([id, lastDay]) => page(`/tournaments/${id}`, lastDay)),
    ...data.athletes
      .filter(([, lastContest, contests]) => indexableAthlete(contests, lastContest, today))
      .map(([id, lastContest]) => page(`/athletes/${id}`, lastContest)),
  ];
}
