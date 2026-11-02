import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { liveWeights } from "@/components/tournament/Overview";
import { stateOf, TournamentHeader, tournamentName } from "@/components/tournament/TournamentHeader";
import { WeightView } from "@/components/tournament/WeightView";
import { competition, competitionChances, competitionContests, competitionResults, lastUpdate } from "@/lib/api";
import { weightBySlug, weightTitle } from "@/lib/weights";

export async function generateMetadata({ params }: PageProps<"/tournaments/[id]/[weight]">): Promise<Metadata> {
  const { id, weight: slug } = await params;
  const weight = weightBySlug(slug);
  const found = Number.isInteger(Number(id)) && weight ? await competition(Number(id)) : null;
  if (!found || !weight) return {};
  return { title: `${weightTitle(weight)} — ${tournamentName(found.name)}` };
}

export default function TournamentWeightPage({ params }: PageProps<"/tournaments/[id]/[weight]">) {
  return (
    <div className="w-full bg-paper pb-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <TournamentWeight params={params} />
      </Suspense>
    </div>
  );
}

async function TournamentWeight({ params }: { params: PageProps<"/tournaments/[id]/[weight]">["params"] }) {
  const { id: raw, weight: slug } = await params;
  const id = Number(raw);
  const weight = weightBySlug(slug);
  if (!Number.isInteger(id) || !weight) notFound();
  const [found, results, contests, chances, updated] = await Promise.all([
    competition(id),
    competitionResults(id),
    competitionContests(id, weight.api),
    competitionChances(id),
    lastUpdate(),
  ]);
  if (!found || !found.weights.includes(weight.api)) notFound();
  return (
    <>
      <TournamentHeader
        competition={found}
        weight={weight}
        state={stateOf(found, (updated ?? new Date().toISOString()).slice(0, 10))}
        live={liveWeights(results)}
      />
      <WeightView
        competition={found}
        weight={weight}
        results={results.filter((r) => r.weight === weight.api)}
        contests={contests}
        chances={chances.filter((c) => c.weight === weight.api)}
      />
    </>
  );
}
