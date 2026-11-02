import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AthleteView } from "@/components/athlete/AthleteView";
import { athlete, athleteHistory, homeLeaders, lastUpdate } from "@/lib/api";
import { fullName } from "@/lib/format";

// One athlete is built ahead (more would load the database at every deploy); any
// other is built on its first visit, then served whole from the cache until the
// data changes (ISR).
export async function generateStaticParams() {
  const leaders = await homeLeaders();
  return leaders.slice(0, 1).map((row) => ({ id: String(row.athlete_id) }));
}

export async function generateMetadata({ params }: PageProps<"/athletes/[id]">): Promise<Metadata> {
  const id = Number((await params).id);
  const found = Number.isInteger(id) ? await athlete(id) : null;
  return found ? { title: `${fullName(found.family_name, found.given_name)} — judo rating` } : {};
}

export default function AthletePage({ params }: PageProps<"/athletes/[id]">) {
  return (
    <div className="w-full bg-paper pt-[25.25px] sm:pt-[41.25px] md:pt-[42.75px] pb-8">
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Athlete params={params} />
      </Suspense>
    </div>
  );
}

async function Athlete({ params }: { params: PageProps<"/athletes/[id]">["params"] }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [found, history, updated] = await Promise.all([athlete(id), athleteHistory(id), lastUpdate()]);
  if (!found || found.rating === null) notFound();
  // "today" is the day of the latest rating run, as on the rankings page
  return <AthleteView athlete={found} history={history} today={(updated ?? "1970-01-01").slice(0, 10)} />;
}
