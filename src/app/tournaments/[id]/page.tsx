import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Overview } from "@/components/tournament/Overview";
import { TournamentSkeleton, tournamentName } from "@/components/tournament/TournamentHeader";
import { competition, competitionChances, competitionContests, competitionResults, competitions } from "@/lib/api";

// One tournament is built ahead (more would load the database at every deploy); any
// other is built on its first visit, then served whole from the cache until the
// data changes (ISR).
export async function generateStaticParams() {
  // the latest with contests (those to come are listed too)
  const latest = (await competitions(null)).filter((c) => c.contests !== null);
  return latest.slice(0, 1).map((c) => ({ id: String(c.id) }));
}

export async function generateMetadata({ params }: PageProps<"/tournaments/[id]">): Promise<Metadata> {
  const id = Number((await params).id);
  const found = Number.isInteger(id) ? await competition(id) : null;
  if (!found) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const name = tournamentName(found.name);
  return {
    title: `${name} judo results`,
    description: `${name}: medallists of every weight, medals by nation, the biggest upsets and rating changes.`,
  };
}

export default function TournamentPage({ params }: PageProps<"/tournaments/[id]">) {
  return (
    <Suspense fallback={<TournamentSkeleton />}>
      <Tournament params={params} />
    </Suspense>
  );
}

async function Tournament({ params }: { params: PageProps<"/tournaments/[id]">["params"] }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [found, results, contests, chances] = await Promise.all([
    competition(id),
    competitionResults(id),
    competitionContests(id),
    competitionChances(id),
  ]);
  if (!found) notFound();
  const drawn = chances.length > 0 || results.length > 0;
  return (
    <>
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
