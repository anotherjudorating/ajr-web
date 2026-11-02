import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Overview } from "@/components/tournament/Overview";
import { TournamentHeader, tournamentName } from "@/components/tournament/TournamentHeader";
import { competition, competitionContests, competitionResults } from "@/lib/api";

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
  const [found, results, contests] = await Promise.all([
    competition(id),
    competitionResults(id),
    competitionContests(id),
  ]);
  if (!found) notFound();
  return (
    <>
      <TournamentHeader competition={found} />
      <Overview competition={found} results={results} contests={contests} />
    </>
  );
}
