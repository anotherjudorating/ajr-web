import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { liveWeights, Overview } from "@/components/tournament/Overview";
import { stateOf, TournamentHeader, tournamentName, type TournamentState } from "@/components/tournament/TournamentHeader";
import { type Competition, competition, competitionChances, competitionContests, competitionResults, competitions, lastUpdate } from "@/lib/api";

// One tournament is built ahead (more would load the database at every deploy); any
// other is built on its first visit, then served whole from the cache until the
// data changes (ISR).
export async function generateStaticParams() {
  const latest = await competitions(null);
  return latest.slice(0, 1).map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: PageProps<"/tournaments/[id]">): Promise<Metadata> {
  const id = Number((await params).id);
  const found = Number.isInteger(id) ? await competition(id) : null;
  if (!found) return {};
  const name = tournamentName(found.name);
  return {
    title: `${name} — results and rating changes`,
    description: `Medallists, upsets and rating changes at the ${name}.`,
  };
}

export default function TournamentPage({ params }: PageProps<"/tournaments/[id]">) {
  return (
    <div className="w-full bg-paper pb-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Tournament params={params} />
      </Suspense>
    </div>
  );
}

async function Tournament({ params }: { params: PageProps<"/tournaments/[id]">["params"] }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [found, results, contests, chances, updated] = await Promise.all([
    competition(id),
    competitionResults(id),
    competitionContests(id),
    competitionChances(id),
    lastUpdate(),
  ]);
  if (!found) notFound();
  // "today" is the day of the latest rating run, as on the rankings
  const state = stateOf(found, (updated ?? new Date().toISOString()).slice(0, 10));
  const live = liveWeights(results);
  const drawn = chances.length > 0 || results.length > 0;
  return (
    <>
      <TournamentHeader competition={found} state={state} live={live} />
      {state !== "over" && drawn && <Lead state={state} found={found} today={updated} />}
      {drawn ? (
        <Overview competition={found} results={results} contests={contests} chances={chances} />
      ) : (
        <div className="mt-10 lg:mt-12 border-t-2 border-ink pt-6 max-w-2xl">
          <h2 className="font-serif text-[20px] leading-[24px] sm:text-[24px] sm:leading-[28px] font-bold tracking-tight">
            Draw not published yet
          </h2>
          <p className="mt-2 text-[14px] text-muted">
            Medal chances appear here once the IJF publishes the draw, usually a day or two before the tournament.
          </p>
        </div>
      )}
    </>
  );
}

// What the lines of a tournament not over yet show.
function Lead({ state, found, today }: { state: TournamentState; found: Competition; today: string | null }) {
  const day = (from: string, to: string) => Math.round((Date.parse(to) - Date.parse(from)) / 86_400_000) + 1;
  const days = day(found.date_from, found.date_to ?? found.date_from);
  const text =
    state === "live"
      ? `Day ${day(found.date_from, (today ?? found.date_from).slice(0, 10))} of ${days}. Finished weights show the medallists; the rest show chances to win a medal, re-simulated after every contest.`
      : "Chances to win a medal, from playing the draw many times with today's ratings.";
  return (
    <p className="mt-6 text-[14px] text-muted max-w-3xl">
      {text}{" "}
      <Link href="/methodology" className="font-serif font-semibold text-claret hover:underline whitespace-nowrap">
        How it works
      </Link>
    </p>
  );
}
