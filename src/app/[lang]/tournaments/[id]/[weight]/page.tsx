import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { stateOf, TournamentSkeleton, tournamentName } from "@/components/tournament/TournamentHeader";
import { WeightView } from "@/components/tournament/WeightView";
import { competition, competitionChances, competitionContests, competitionResults, competitions, competitionSlots, lastUpdate } from "@/lib/api";
import { WEIGHTS, weightBySlug, weightTitle } from "@/lib/weights";
import { NOINDEX } from "@/lib/seo";
import { shortName } from "@/lib/format";

const MEDALS = ["gold", "silver", "bronze"];

const MAJOR = ["Olympic Games", "World Championships", "Masters", "Grand Slam"];

// One weight of one tournament is built ahead (more would load the database at every
// deploy); any other is built on its first visit, then served whole from the cache
// until the data changes (ISR).
export async function generateStaticParams() {
  // the latest with contests (those to come are listed too, without weights)
  const [latest] = (await competitions(null)).filter((c) => c.contests !== null);
  const found = latest ? await competition(latest.id) : null;
  const weight = WEIGHTS.find((w) => w.api === found?.weights[0]);
  return found && weight ? [{ id: String(found.id), weight: weight.slug }] : [];
}

export async function generateMetadata({ params }: PageProps<"/tournaments/[id]/[weight]">): Promise<Metadata> {
  const { id, weight: slug } = await params;
  const weight = weightBySlug(slug);
  const found = Number.isInteger(Number(id)) && weight ? await competition(Number(id)) : null;
  if (!found || !weight || !(found.weights.includes(weight.api) || (await underWay(found)))) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const name = tournamentName(found.name);
  // its medallists, once there are: "gold Fawaz M. (FRA), silver …"
  const results = (await competitionResults(found.id)).filter((r) => r.weight === weight.api);
  const medals = MEDALS.flatMap((medal) =>
    results.filter((r) => r.result === medal).map((r) => `${medal} ${shortName(r.family_name, r.given_name)}${r.country ? ` (${r.country})` : ""}`),
  );
  return {
    title: `${weightTitle(weight)} ${name} judo results`,
    description: `${weightTitle(weight)} at the ${name}${medals.length ? `: ${medals.join(", ")}` : ""}.`,
    // the weights of the events people search for; the others reachable, not indexed
    ...(MAJOR.includes(found.rank_name ?? "") ? {} : { robots: NOINDEX }),
  };
}

export default function TournamentWeightPage({ params }: PageProps<"/tournaments/[id]/[weight]">) {
  return (
    <Suspense fallback={<TournamentSkeleton />}>
      <TournamentWeight params={params} />
    </Suspense>
  );
}

async function TournamentWeight({ params }: { params: PageProps<"/tournaments/[id]/[weight]">["params"] }) {
  const { id: raw, weight: slug } = await params;
  const id = Number(raw);
  const weight = weightBySlug(slug);
  if (!Number.isInteger(id) || !weight) notFound();
  const [found, results, contests, chances, places, updated] = await Promise.all([
    competition(id),
    competitionResults(id),
    competitionContests(id, weight.api),
    competitionChances(id),
    competitionSlots(id, weight.api),
    lastUpdate(),
  ]);
  if (!found) notFound();
  const weightChances = chances.filter((c) => c.weight === weight.api);
  if (!found.weights.includes(weight.api) && !weightChances.length) {
    // a weight of a tournament not over that has not started: the header stays, and this
    if (stateOf(found, (updated ?? "1970-01-01").slice(0, 10)) === "over") notFound();
    return (
      <div className="mt-10 lg:mt-12 border-t-2 border-ink pt-6 max-w-2xl">
        <h2 className="font-serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight">{weightTitle(weight)}: not started</h2>
        <p className="mt-2 text-[14px] text-muted">
          Its draw, medal chances and contests appear here once the IJF publishes them, usually the day before it is fought.
        </p>
      </div>
    );
  }
  return (
    <>
      <WeightView
        results={results.filter((r) => r.weight === weight.api)}
        contests={contests}
        chances={weightChances}
        bracket={places}
      />
    </>
  );
}

// Not over yet (by the latest rating run's day): every weight has a page.
async function underWay(found: Awaited<ReturnType<typeof competition>> & object) {
  return stateOf(found, ((await lastUpdate()) ?? "1970-01-01").slice(0, 10)) !== "over";
}
