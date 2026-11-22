// What search engines are shown: the site's address, which pages are worth
// indexing, and the robots rule for the rest.

import type { Metadata } from "next";

import { DEFAULT_LANG, type Lang, localeOf, localePath, PUBLISHED } from "@/i18n/locales";
import { shortName } from "@/lib/format";

export const SITE = "https://www.anotherjudorating.com";

// Pages that stay reachable and linked but out of the index: a filtered list, a
// past day's table, a pair, an athlete with little to show.
export const NOINDEX: Metadata["robots"] = { index: false, follow: true };

// An athlete page says enough to be indexed when they have 5 rated contests or more,
// or fought in the last four years. The sitemap lists the same ones.
export function indexableAthlete(contests: number, lastContest: string | null, today: string): boolean {
  if (contests >= 5) return true;
  if (!lastContest) return false;
  const fourYearsAgo = `${Number(today.slice(0, 4)) - 4}${today.slice(4, 10)}`;
  return lastContest >= fourYearsAgo;
}

// A table's first three for a description: "1. Grigalashvili T. (GEO), 2. …".
export function podium(rows: { place: number; family_name: string | null; given_name: string | null; country: string | null }[]): string {
  return rows
    .slice(0, 3)
    .map((r) => `${r.place}. ${shortName(r.family_name, r.given_name)}${r.country ? ` (${r.country})` : ""}`)
    .join(", ");
}

// Any query parameter makes a list page a filtered state of it.
export function hasParams(query: Record<string, string | string[] | undefined>): boolean {
  return Object.values(query).some((value) => value !== undefined && value !== "");
}

// A page's address in a language: the site's, the prefix (none for English), the
// path; the home page without a trailing slash, as the canonical has always been.
export function localeUrl(lang: Lang, path: string): string {
  const prefixed = localePath(lang, path);
  return `${SITE}${prefixed === "/" ? "" : prefixed}`;
}

// The page's canonical address and, for an indexed page, the same page in every
// published language (hreflang), English as the default. Explicit, not the relative
// "./" the layout had: that would resolve to the rewritten /en/... path. A page kept
// out of the index (NOINDEX) gets its canonical only.
export function alternatesFor(lang: Lang, path: string, { indexed = true }: { indexed?: boolean } = {}): Metadata["alternates"] {
  const canonical = localeUrl(lang, path);
  if (!indexed || PUBLISHED.length < 2 || !localeOf(lang).published) return { canonical };
  return {
    canonical,
    languages: {
      ...Object.fromEntries(PUBLISHED.map((locale) => [locale.htmlLang, localeUrl(locale.code, path)])),
      "x-default": localeUrl(DEFAULT_LANG, path),
    },
  };
}
