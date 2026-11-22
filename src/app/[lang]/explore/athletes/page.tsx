import type { Metadata } from "next";
import { Suspense } from "react";

import { AthletesBrowser } from "@/components/explore/AthletesBrowser";
import { athletesPage, lastUpdate, nations } from "@/lib/api";
import { plain } from "@/lib/params";
import { WEIGHTS } from "@/lib/weights";
import { alternatesFor, hasParams, NOINDEX } from "@/lib/seo";
import { i18n } from "@/i18n/server";

// The list is indexed; a filtered or sorted state of it is not.
export async function generateMetadata({ searchParams }: PageProps<"/[lang]/explore/athletes">): Promise<Metadata> {
  const { lang, d } = await i18n();
  const metadata: Metadata = { title: d.explore.athletes.meta.title, description: d.explore.athletes.meta.description };
  const filtered = hasParams(await searchParams);
  metadata.alternates = alternatesFor(lang, "/explore/athletes", { indexed: !filtered });
  return filtered ? { ...metadata, robots: NOINDEX } : metadata;
}

export default function AthletesPage({ searchParams }: PageProps<"/[lang]/explore/athletes">) {
  return (
    <Suspense fallback={<AthletesBrowser loading rows={[]} filters={{}} countries={[]} year={0} />}>
      <Athletes searchParams={searchParams} />
    </Suspense>
  );
}

async function Athletes({ searchParams }: { searchParams: PageProps<"/[lang]/explore/athletes">["searchParams"] }) {
  const filters = plain(await searchParams);
  const size = [20, 50, 100].includes(Number(filters.size)) ? Number(filters.size) : 50;
  const page = Math.max(1, Number(filters.page) || 1);
  // weight: a weight's slug, or "men" / "women" for all of a gender
  const weight = WEIGHTS.find((w) => w.slug === filters.weight)?.api;
  const gender = filters.weight === "men" ? "male" : filters.weight === "women" ? "female" : undefined;
  const [rows, countries, updated] = await Promise.all([
    athletesPage({ q: filters.q?.slice(0, 60), country: filters.country, gender, weight, sort: filters.sort, top: size, skip: (page - 1) * size }),
    nations(),
    lastUpdate(),
  ]);
  return (
    <AthletesBrowser
      rows={rows}
      filters={{ ...filters, size: String(size), page: String(page) }}
      countries={countries.map((c) => ({ code: c.country, name: c.name }))}
      year={Number((updated ?? "1970").slice(0, 4))}
    />
  );
}
