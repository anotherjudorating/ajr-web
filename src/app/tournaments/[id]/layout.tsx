import { notFound } from "next/navigation";
import { Suspense } from "react";

import { stateOf, TournamentHeader } from "@/components/tournament/TournamentHeader";
import { competition, competitionResults, lastUpdate } from "@/lib/api";
import { liveWeights } from "@/lib/live";

// A tournament's header (the name, the place, the weights) stays while its weights
// change: only the page under it loads again.
export default function TournamentLayout({ params, children }: LayoutProps<"/tournaments/[id]">) {
  return (
    <div className="w-full bg-paper pb-8">
      <Suspense fallback={<div className="min-h-[180px]" />}>
        <Header params={params} />
      </Suspense>
      {children}
    </div>
  );
}

async function Header({ params }: { params: LayoutProps<"/tournaments/[id]">["params"] }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [found, results, updated] = await Promise.all([competition(id), competitionResults(id), lastUpdate()]);
  if (!found) notFound();
  // "today" is the day of the latest rating run, as on the rankings
  return <TournamentHeader competition={found} state={stateOf(found, (updated ?? "1970-01-01").slice(0, 10))} live={liveWeights(results)} />;
}
