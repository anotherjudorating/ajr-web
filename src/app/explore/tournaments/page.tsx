import type { Metadata } from "next";
import { Suspense } from "react";

import { TournamentsBrowser } from "@/components/explore/TournamentsBrowser";
import { competitions, lastUpdate } from "@/lib/api";
import { hasParams, NOINDEX } from "@/lib/seo";

// The list is indexed; a filtered or sorted state of it is not.
export async function generateMetadata({ searchParams }: PageProps<"/explore/tournaments">): Promise<Metadata> {
  const metadata: Metadata = {
    title: "Judo tournament results",
    description:
      "Every judo World Tour tournament since 2009: Olympics, Worlds, Grand Slams and Grand Prix, with results, upsets and how often the favourite won.",
  };
  return hasParams(await searchParams) ? { ...metadata, robots: NOINDEX } : metadata;
}

export default function TournamentsPage({ searchParams }: PageProps<"/explore/tournaments">) {
  return (
    <Suspense fallback={<TournamentsBrowser loading rows={[]} year={0} latestYear={0} />}>
      <Tournaments searchParams={searchParams} />
    </Suspense>
  );
}

async function Tournaments({ searchParams }: { searchParams: PageProps<"/explore/tournaments">["searchParams"] }) {
  const latestYear = Number(((await lastUpdate()) ?? "1970").slice(0, 4));
  const asked = Number((await searchParams).year);
  const year = asked >= 2009 && asked <= latestYear ? asked : latestYear;
  const rows = await competitions(year);
  return <TournamentsBrowser key={year} rows={rows} year={year} latestYear={latestYear} />;
}
