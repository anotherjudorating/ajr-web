import type { Metadata } from "next";
import { Suspense } from "react";

import { TournamentsBrowser } from "@/components/explore/TournamentsBrowser";
import { competitions, lastUpdate } from "@/lib/api";

export const metadata: Metadata = { title: "Tournaments — judo results and rating accuracy" };

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
