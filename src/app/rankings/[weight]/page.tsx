import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RankingsBrowser } from "@/components/rankings/RankingsBrowser";
import { WeightSwitcher } from "@/components/WeightSwitcher";
import { lastUpdate, leaderboard } from "@/lib/api";
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
  return (
    <div className="flex flex-col w-full">
      <div className="w-full bg-paper pt-6 sm:pt-8 pb-8">
        <Suspense fallback={<div className="min-h-[60vh]" />}>
          <Rankings params={params} searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;

async function Rankings({ params, searchParams }: PageProps<"/rankings/[weight]">) {
  const weight = weightBySlug((await params).weight);
  if (!weight) notFound();
  const date = (await searchParams).date;
  const day = typeof date === "string" && DAY.test(date) ? date : undefined;

  // "today" is the day of the latest rating run: the data is not newer than that
  const latest = ((await lastUpdate()) ?? "1970-01-01").slice(0, 10);
  const asOf = day && day < latest ? day : latest;
  const rows = await leaderboard(weight.api, asOf === latest ? undefined : asOf);
  const path = `/rankings/${weight.slug}`;

  return (
    <>
      <h1 className="sr-only">{weightTitle(weight)} — judo world ranking</h1>
      <WeightSwitcher current={path} query={asOf === latest ? "" : `?date=${asOf}`} />
      <RankingsBrowser
        key={`${path}-${asOf}`}
        rows={rows}
        weight={weight.api}
        asOf={asOf}
        latest={latest}
        path={path}
        csvName={`ajr-${weight.slug}-${asOf}.csv`}
      />
    </>
  );
}
