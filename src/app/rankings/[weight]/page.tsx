import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { RankingTable } from "@/components/RankingTable";
import { WeightSwitcher } from "@/components/WeightSwitcher";
import { leaderboard } from "@/lib/api";
import { WEIGHTS, weightBySlug, weightTitle } from "@/lib/weights";

// All 14 tables are rendered at build time and refreshed with the data (next.config.ts).
export function generateStaticParams() {
  return WEIGHTS.map((w) => ({ weight: w.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rankings/[weight]">): Promise<Metadata> {
  const weight = weightBySlug((await params).weight);
  return weight ? { title: `${weightTitle(weight)} ranking` } : {};
}

export default function RankingsPage({ params }: PageProps<"/rankings/[weight]">) {
  return (
    <Suspense fallback={<p className="text-muted text-[14px]">Loading…</p>}>
      <Rankings params={params} />
    </Suspense>
  );
}

async function Rankings({ params }: Pick<PageProps<"/rankings/[weight]">, "params">) {
  const weight = weightBySlug((await params).weight);
  if (!weight) notFound();
  const rows = await leaderboard(weight.api);

  return (
    <>
      <div className="border-b-2 border-ink pb-3">
        <h1 className="font-serif text-[28px] leading-[32px] sm:text-[36px] sm:leading-[40px] font-bold tracking-tight">
          {weightTitle(weight)} — judo world ranking
        </h1>
        <p className="mt-1.5 text-[14px] text-muted">
          Glicko-2 rating minus three times its uncertainty. Athletes without a contest for a year
          are not listed.
        </p>
      </div>
      <div className="mt-5">
        <WeightSwitcher current={weight} basePath="/rankings" />
      </div>
      <div className="mt-6">
        <RankingTable rows={rows} />
      </div>
    </>
  );
}
