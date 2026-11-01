import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RankingsBrowser } from "@/components/rankings/RankingsBrowser";
import { leaderboard } from "@/lib/api";
import { tableDay } from "@/lib/days";
import { WEIGHTS, weightBySlug, weightTitle } from "@/lib/weights";

// All 14 tables are rendered ahead of time and refreshed with the data (next.config.ts).
export function generateStaticParams() {
  return WEIGHTS.map((w) => ({ weight: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/[weight]">): Promise<Metadata> {
  const weight = weightBySlug((await params).weight);
  return weight ? { title: `${weightTitle(weight)} — judo world ranking` } : {};
}

export default function RankingsPage({ params, searchParams }: PageProps<"/rankings/[weight]">) {
  // the URL is read inside the Suspense, so the page's shell is static and a move
  // between tables is instant; meanwhile the toolbar and the table's header show
  return (
    <Suspense fallback={<RankingsBrowser loading rows={[]} asOf="" latest="" path="" csvName="" />}>
      <Rankings params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function Rankings({ params, searchParams }: PageProps<"/rankings/[weight]">) {
  const weight = weightBySlug((await params).weight);
  if (!weight) notFound();
  const { asOf, latest, past } = await tableDay((await searchParams).date);
  const rows = await leaderboard(weight.api, past);
  const path = `/rankings/${weight.slug}`;

  return (
    <>
      <h1 className="sr-only">{weightTitle(weight)} — judo world ranking</h1>
      <RankingsBrowser
        key={`${path}-${asOf}`}
        rows={rows}
        asOf={asOf}
        latest={latest}
        path={path}
        csvName={`ajr-${weight.slug}-${asOf}.csv`}
      />
    </>
  );
}
