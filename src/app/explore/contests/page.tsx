import type { Metadata } from "next";
import { Suspense } from "react";

import { ContestsBrowser } from "@/components/explore/ContestsBrowser";
import { competitions, contestsPage, lastUpdate } from "@/lib/api";
import { plain } from "@/lib/params";
import { WEIGHTS } from "@/lib/weights";

export const metadata: Metadata = { title: "Contests — judo results with win chances" };

export default function ContestsPage({ searchParams }: PageProps<"/explore/contests">) {
  return (
    <Suspense fallback={<ContestsBrowser loading rows={[]} filters={{}} tournaments={[]} years={[]} />}>
      <Contests searchParams={searchParams} />
    </Suspense>
  );
}

async function Contests({ searchParams }: { searchParams: PageProps<"/explore/contests">["searchParams"] }) {
  const filters = plain(await searchParams);
  const latestYear = Number(((await lastUpdate()) ?? "1970").slice(0, 4));
  const year = Number(filters.year) >= 2009 && Number(filters.year) <= latestYear ? Number(filters.year) : latestYear;
  const size = [20, 50, 100].includes(Number(filters.size)) ? Number(filters.size) : 50;
  const page = Math.max(1, Number(filters.page) || 1);
  const weight = WEIGHTS.find((w) => w.slug === filters.weight)?.api;
  const [rows, tournaments] = await Promise.all([
    contestsPage({
      year,
      weight,
      competition: Number(filters.tournament) || undefined,
      upsets: filters.result === "upsets",
      q: filters.q,
      sort: filters.sort,
      top: size,
      skip: (page - 1) * size,
    }),
    competitions(year),
  ]);
  const years = Array.from({ length: Math.max(latestYear - 2008, 1) }, (_, i) => latestYear - i);
  return (
    <ContestsBrowser
      rows={rows}
      filters={{ ...filters, year: String(year), size: String(size), page: String(page) }}
      tournaments={tournaments.map((t) => ({ id: t.id, name: t.name }))}
      years={years}
    />
  );
}
