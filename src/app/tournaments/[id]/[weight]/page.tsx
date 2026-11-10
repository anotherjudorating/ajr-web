import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { liveWeights } from "@/lib/live";
import { stateOf, TournamentHeader, tournamentName } from "@/components/tournament/TournamentHeader";
import { WeightView } from "@/components/tournament/WeightView";
import { competition, competitionChances, competitionContests, competitionResults, competitions, lastUpdate } from "@/lib/api";
import { WEIGHTS, weightBySlug, weightTitle } from "@/lib/weights";
import { NOINDEX } from "@/lib/seo";

const MAJOR = ["Olympic Games", "World Championships", "Masters", "Grand Slam"];

// One weight of one tournament is built ahead (more would load the database at every
// deploy); any other is built on its first visit, then served whole from the cache
// until the data changes (ISR).
export async function generateStaticParams() {
  const [latest] = await competitions(null);
  const found = latest ? await competition(latest.id) : null;
  const weight = WEIGHTS.find((w) => w.api === found?.weights[0]);
  return found && weight ? [{ id: String(found.id), weight: weight.slug }] : [];
}

export async function generateMetadata({ params }: PageProps<"/tournaments/[id]/[weight]">): Promise<Metadata> {
  const { id, weight: slug } = await params;
  const weight = weightBySlug(slug);
  const found = Number.isInteger(Number(id)) && weight ? await competition(Number(id)) : null;
  if (!found || !weight || !found.weights.includes(weight.api)) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const name = tournamentName(found.name);
  return {
    title: `${weightTitle(weight)} at the ${name} — results`,
    description: `${weightTitle(weight)} at the ${name}: medallists, every contest with win chances, rating changes.`,
    // the weights of the events people search for; the others reachable, not indexed
    ...(MAJOR.includes(found.rank_name ?? "") ? {} : { robots: NOINDEX }),
  };
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
        state={stateOf(found, (updated ?? "1970-01-01").slice(0, 10))}
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
