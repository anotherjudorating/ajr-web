import type { Metadata } from "next";
import { Suspense } from "react";

import { TournamentsBrowser } from "@/components/explore/TournamentsBrowser";
import { competitions, lastUpdate } from "@/lib/api";
import { alternatesFor, hasParams, NOINDEX } from "@/lib/seo";
import { i18n } from "@/i18n/server";

// The list is indexed; a filtered or sorted state of it is not.
export async function generateMetadata({ searchParams }: PageProps<"/[lang]/explore/tournaments">): Promise<Metadata> {
  const { lang, d } = await i18n();
  const metadata: Metadata = { title: d.explore.tournaments.meta.title, description: d.explore.tournaments.meta.description };
  const filtered = hasParams(await searchParams);
  metadata.alternates = alternatesFor(lang, "/explore/tournaments", { indexed: !filtered });
  return filtered ? { ...metadata, robots: NOINDEX } : metadata;
}

export default function TournamentsPage({ searchParams }: PageProps<"/[lang]/explore/tournaments">) {
  return (
    <Suspense fallback={<TournamentsBrowser loading rows={[]} year={0} latestYear={0} />}>
      <Tournaments searchParams={searchParams} />
    </Suspense>
  );
}

async function Tournaments({ searchParams }: { searchParams: PageProps<"/[lang]/explore/tournaments">["searchParams"] }) {
  const today = ((await lastUpdate()) ?? "1970-01-01").slice(0, 10);
  const latestYear = Number(today.slice(0, 4));
  const asked = Number((await searchParams).year);
  const year = asked >= 2009 && asked <= latestYear ? asked : latestYear;
  const rows = await competitions(year);
  return <TournamentsBrowser key={year} rows={rows} year={year} latestYear={latestYear} today={today} />;
}
