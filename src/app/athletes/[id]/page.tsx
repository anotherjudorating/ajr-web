import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AthleteView } from "@/components/athlete/AthleteView";
import { athlete, athleteHistory, homeLeaders, lastUpdate } from "@/lib/api";
import { fullName } from "@/lib/format";
import type { Athlete } from "@/lib/api";
import { monthYear } from "@/lib/format";
import { indexableAthlete, NOINDEX } from "@/lib/seo";
import { WEIGHTS, weightTitle } from "@/lib/weights";

// One athlete is built ahead (more would load the database at every deploy); any
// other is built on its first visit, then served whole from the cache until the
// data changes (ISR).
export async function generateStaticParams() {
  const leaders = await homeLeaders();
  return leaders.slice(0, 1).map((row) => ({ id: String(row.athlete_id) }));
}

export async function generateMetadata({ params }: PageProps<"/athletes/[id]">): Promise<Metadata> {
  const id = Number((await params).id);
  const [found, updated] = await Promise.all([Number.isInteger(id) ? athlete(id) : null, lastUpdate()]);
  if (!found || found.rating === null) notFound(); // a crawler is sent the head first: only here does a 404 get its status
  const name = fullName(found.family_name, found.given_name);
  const today = (updated ?? "1970-01-01").slice(0, 10);
  return {
    title: `${name} — judo rating, results and record`,
    description: athleteSummary(found),
    // a few contests long ago: reachable, not indexed (lib/seo.ts)
    ...(indexableAthlete(found.contests, found.last_contest, today) ? {} : { robots: NOINDEX }),
  };
}

// The athlete in a sentence or two, from the data: for search results and previews.
function athleteSummary(a: Athlete): string {
  const name = fullName(a.family_name, a.given_name);
  const who = [a.country_name, a.birth_year ? `born ${a.birth_year}` : null].filter(Boolean).join(", ");
  const weight = WEIGHTS.find((w) => w.api === a.weight);
  const where = weight ? weightTitle(weight) : "judo";
  const standing =
    a.place !== null
      ? `is #${a.place} in the ${where} rating (score ${a.score}${a.wrl_place ? `; IJF World Ranking #${a.wrl_place}` : ""})`
      : `is rated in ${where} (not in the table: no contest in the last year)`;
  const peak = a.peak_score && a.peak_on ? ` Peak ${a.peak_score} in ${monthYear(a.peak_on)}.` : "";
  return `${name}${who ? ` (${who})` : ""} ${standing}.${peak} ${a.contests} rated IJF contests with win chances and rating changes.`;
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
